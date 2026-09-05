import { useEffect, useRef } from 'react';

type Reel = {
  still: string;
  video: string;
  grade: string;
  weather: 'dust' | 'rain' | 'embers';
};

const REEL: Record<string, Reel> = {
  lobby: { still: '/film/dusk.png', video: '/film/lamps.mp4', grade: 'dusk', weather: 'dust' },
  manifesto: { still: '/film/dusk.png', video: '/film/lamps.mp4', grade: 'gold', weather: 'dust' },
  everyday: { still: '/film/crisis.png', video: '/film/rain.mp4', grade: 'storm', weather: 'rain' },
  opportunity: { still: '/film/crisis.png', video: '/film/rain.mp4', grade: 'prestige', weather: 'embers' },
  values: { still: '/film/crisis.png', video: '/film/rain.mp4', grade: 'storm', weather: 'rain' },
  soapbox: { still: '/film/dusk.png', video: '/film/lamps.mp4', grade: 'gold', weather: 'dust' },
  election: { still: '/film/chamber.png', video: '/film/lamps.mp4', grade: 'vault', weather: 'dust' },
  reveal: { still: '/film/chamber.png', video: '/film/lamps.mp4', grade: 'vault', weather: 'embers' },
  allocation: { still: '/film/chamber.png', video: '/film/lamps.mp4', grade: 'gold', weather: 'dust' },
  results: { still: '/film/chamber.png', video: '/film/lamps.mp4', grade: 'aftermath', weather: 'embers' },
};

type Speck = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  gold: boolean;
};

export function Atmosphere({
  phase,
  flash,
}: {
  phase: string;
  flash?: boolean;
}) {
  const reel = REEL[phase] ?? REEL.lobby;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let dead = false;
    const specks: Speck[] = [];
    const weather = reel.weather;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = (n: number) => {
      for (let i = 0; i < n; i += 1) {
        specks.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: weather === 'rain' ? -1.2 - Math.random() * 2 : (Math.random() - 0.5) * 0.25,
          vy: weather === 'rain' ? 10 + Math.random() * 16 : weather === 'embers' ? -0.4 - Math.random() * 0.8 : -0.15 - Math.random() * 0.35,
          r: weather === 'rain' ? 0.6 + Math.random() * 1.2 : 0.7 + Math.random() * 1.8,
          a: 0.15 + Math.random() * 0.45,
          gold: weather === 'embers' || Math.random() > 0.7,
        });
      }
    };
    spawn(weather === 'rain' ? 140 : 70);

    const onMove = (event: PointerEvent) => {
      mouse.current.tx = event.clientX / window.innerWidth;
      mouse.current.ty = event.clientY / window.innerHeight;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };
    window.addEventListener('pointermove', onMove);

    const tick = () => {
      if (dead || !ctx) return;
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.08;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of specks) {
        s.x += s.vx + (mouse.current.x - 0.5) * 0.6;
        s.y += s.vy;
        if (s.y < -10) s.y = canvas.height + 10;
        if (s.y > canvas.height + 10) s.y = -10;
        if (s.x < -10) s.x = canvas.width + 10;
        if (s.x > canvas.width + 10) s.x = -10;
        ctx.beginPath();
        if (weather === 'rain') {
          ctx.strokeStyle = `rgba(200,220,255,${s.a})`;
          ctx.lineWidth = s.r;
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - 4, s.y + 16);
          ctx.stroke();
        } else {
          ctx.fillStyle = s.gold ? `rgba(245,158,11,${s.a})` : `rgba(255,255,255,${s.a})`;
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      dead = true;
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reel.weather]);

  return (
    <div className={`film-world grade-${reel.grade} ${flash ? 'is-slam' : ''}`} aria-hidden>
      <div
        className="film-still kenburns"
        style={{ backgroundImage: `url(${reel.still})` }}
      />
      <video
        key={reel.video}
        className="film-video"
        src={reel.video}
        autoPlay
        muted
        loop
        playsInline
      />
      <canvas ref={canvasRef} className="film-weather" />
      <div className="film-grain" />
      <div className="film-vignette" />
      <div className="film-leak" />
      <div className="film-letterbox top" />
      <div className="film-letterbox bottom" />
      <div ref={ringRef} className="film-cursor-ring" />
      <div ref={dotRef} className="film-cursor-dot" />
    </div>
  );
}
