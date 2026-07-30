import { forwardRef, type MouseEvent, type ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';
import { spawnRipple } from '@/lib/utils/ripple';

interface PremiumButtonBaseProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  children: ReactNode;
}

type PremiumButtonProps = PremiumButtonBaseProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'>)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>)
  );

/**
 * Botão único do site: magnético (segue o cursor sutilmente), glow na borda
 * só durante o hover, e ripple só durante o clique — nada roda em idle.
 * variant="primary" = dourado preenchido; "secondary" = outline com glass.
 */
export const PremiumButton = forwardRef<HTMLAnchorElement | HTMLButtonElement, PremiumButtonProps>(
  ({ variant = 'primary', className = '', children, onClick, ...props }, forwardedRef) => {
    const magneticRef = useMagnetic<HTMLAnchorElement | HTMLButtonElement>(0.2);

    const setRefs = (node: HTMLAnchorElement | HTMLButtonElement | null) => {
      magneticRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const handleClick = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      spawnRipple(e.currentTarget, e.clientX, e.clientY);
      type ClickHandler = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
      (onClick as ClickHandler | undefined)?.(e);
    };

    const base = variant === 'primary' ? 'btn-gold' : 'btn-outline-premium glow-on-hover';
    const classes = `${base} ripple-container inline-flex items-center justify-center gap-2 ${className}`;

    if ('href' in props && props.href) {
      const { href, ...anchorProps } = props as { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a
          ref={setRefs as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          onClick={handleClick}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={setRefs as React.Ref<HTMLButtonElement>}
        type={buttonProps.type ?? 'button'}
        className={classes}
        onClick={handleClick}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);
PremiumButton.displayName = 'PremiumButton';
