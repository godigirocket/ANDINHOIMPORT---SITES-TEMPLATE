import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; size: number;
  speedX: number; speedY: number;
  opacity: number; life: number; maxLife: number;
  type: 'dot' | 'star' | 'line';
  angle: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const mouseRef  = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    const spawn = (): Particle => {
      const types: Particle['type'][] = ['dot', 'dot', 'dot', 'star', 'line'];
      return {
        x:       Math.random() * canvas.width,
        y:       canvas.height + 10,
        size:    Math.random() * 1.8 + 0.4,
        speedY:  -(Math.random() * 0.5 + 0.15),
        speedX:  (Math.random() - 0.5) * 0.25,
        opacity: 0, life: 0,
        maxLife: Math.random() * 400 + 250,
        type:    types[Math.floor(Math.random() * types.length)],
        angle:   Math.random() * Math.PI * 2,
      };
    };

    // Seed
    for (let i = 0; i < 50; i++) {
      const p = spawn();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.current.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.current.length < 70 && Math.random() < 0.4) {
        particles.current.push(spawn());
      }
      particles.current = particles.current.filter(p => p.life < p.maxLife);

      for (const p of particles.current) {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += 0.01;

        const prog = p.life / p.maxLife;
        p.opacity = prog < 0.1 ? prog / 0.1 : prog > 0.8 ? (1 - prog) / 0.2 : 1;

        // Mouse repulsion — partículas fogem do cursor
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const force = (80 - dist) / 80;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        const alpha = p.opacity * 0.5;
        ctx.save();

        if (p.type === 'star') {
          // Estrela de 4 pontas
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = `hsla(43,96%,52%,${alpha})`;
          ctx.beginPath();
          for (let j = 0; j < 4; j++) {
            const a = (j / 4) * Math.PI * 2;
            const r = p.size * 2.5;
            const ri = p.size * 0.8;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            ctx.lineTo(Math.cos(a + Math.PI / 4) * ri, Math.sin(a + Math.PI / 4) * ri);
          }
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'line') {
          // Linha curta brilhante
          ctx.strokeStyle = `hsla(43,96%,52%,${alpha * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 12, p.y + p.speedY * 12);
          ctx.stroke();
        } else {
          // Ponto com glow
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grad.addColorStop(0, `hsla(43,96%,52%,${alpha})`);
          grad.addColorStop(0.5, `hsla(43,96%,52%,${alpha * 0.3})`);
          grad.addColorStop(1, `hsla(43,96%,52%,0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Linhas de conexão entre partículas próximas
      const pts = particles.current.filter(p => p.type === 'dot' && p.opacity > 0.5);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(43,96%,52%,${(1 - d / 120) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
