import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseleave', onMouseLeave);

    const PARTICLE_COUNT = 60;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => createParticle(w, h));

    function createParticle(cw: number, ch: number): Particle {
      return {
        x: Math.random() * cw,
        y: Math.random() * ch,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.15 + Math.random() * 0.35,
        life: 0,
        maxLife: 300 + Math.random() * 200,
      };
    }

    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.003;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        p.life++;

        // Mouse influence
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.02;
          p.vx -= dx * force;
          p.vy -= dy * force;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Drift
        p.vy -= 0.002;

        p.x += p.vx;
        p.y += p.vy;

        // Fade in/out
        let alpha = p.alpha;
        if (p.life < 60) alpha *= p.life / 60;
        if (p.life > p.maxLife - 60) alpha *= (p.maxLife - p.life) / 60;

        // Wrap / respawn
        if (p.y < -20 || p.x < -20 || p.x > w + 20 || p.life > p.maxLife) {
          Object.assign(p, createParticle(w, h));
          p.y = h + 10;
          p.x = Math.random() * w;
          alpha = 0;
        }

        // Draw
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grad.addColorStop(0, 'rgba(255, 182, 144, 0.06)');
        grad.addColorStop(1, 'rgba(255, 182, 144, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8);

        // Core
        ctx.globalAlpha = alpha * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffb690';
        ctx.fill();

        ctx.restore();
      }

      // Connection lines between close particles
      ctx.save();
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.globalAlpha = (1 - dist / 120) * 0.06;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = '#ffb690';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}

export default AmbientParticles;
