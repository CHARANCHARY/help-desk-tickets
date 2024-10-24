import React, { useRef, useEffect, useState } from 'react';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const colors = ['red', '#f57900', 'yellow', '#ce5c00', '#5c3566'];

  const w = window.innerWidth;
  const h = window.innerHeight;
  const arc = 120;
  const size = 12;
  const speed = 20;
  const rate = 100;
  const parts = [3];

  const createParticles = () => {
    for (let i = 0; i < arc; i++) {
      parts[i] = {
        x: Math.ceil(Math.random() * w),
        y: Math.ceil(Math.random() * h),
        toX: Math.random() * 5 - 1,
        toY: Math.random() * 2 - 1,
        c: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * size,
      };
    }
  };

  const DistanceBetween = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const particles = (ctx, time) => {
    ctx.clearRect(0, 0, w, h);

    parts.forEach((part, i) => {
      const distanceFactor = Math.max(Math.min(15 - DistanceBetween(mouse, part) / 10, 10), 1);
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.size * distanceFactor, 0, Math.PI * 2, false);
      ctx.fillStyle = part.c;
      ctx.strokeStyle = part.c;
      if (i % 2 === 0) {
        ctx.stroke();
      } else {
        ctx.fill();
      }

      part.x += part.toX * (time * 0.05);
      part.y += part.toY * (time * 0.05);

      if (part.x > w) part.x = 0;
      if (part.y > h) part.y = 0;
      if (part.x < 0) part.x = w;
      if (part.y < 0) part.y = h;
    });

    if (time < speed) {
      setTimeout(() => particles(ctx, time + 1), 1000 / rate);
    } else {
      setTimeout(() => particles(ctx, time), 1000 / rate);
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;

    createParticles();
    particles(ctx, 0);

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="test"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default ParticleCanvas;
