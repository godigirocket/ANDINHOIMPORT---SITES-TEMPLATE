/**
 * Divide o texto em letras que respondem individualmente ao hover
 * (CSS puro — cada span reage ao próprio :hover, sem custo em JS).
 * Agrupa por palavra (nowrap) pra nunca quebrar uma palavra no meio da linha.
 */
export function CharHoverText({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={`char-hover-group ${className}`}>
      {words.map((word, wi) => (
        <span key={wi}>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {word.split('').map((ch, ci) => (
              <span key={ci} className="char">{ch}</span>
            ))}
          </span>
          {wi < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}
