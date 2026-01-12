import React, { useRef, useEffect } from 'react';

const PhysicsBackground = ({ gravityEnabled }) => {
    const canvasRef = useRef(null);
    const elementsRef = useRef([]);
    const mouseRef = useRef({ x: -9999, y: -9999, active: false });
    const animRef = useRef();

    useEffect(() => {
        const colors = ['rgba(56,189,248,0.4)', 'rgba(168,85,247,0.4)', 'rgba(52,211,153,0.4)', 'rgba(255,255,255,0.1)'];
        elementsRef.current = Array.from({ length: 25 }).map(() => ({
            x: Math.random() * innerWidth, y: Math.random() * innerHeight,
            vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 40 + 15, color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.05
        }));

        const onResize = () => { if (canvasRef.current) { canvasRef.current.width = innerWidth; canvasRef.current.height = innerHeight; } };
        window.addEventListener('resize', onResize); onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const step = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (mouseRef.current.active) {
                const gradient = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, 150);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath(); ctx.arc(mouseRef.current.x, mouseRef.current.y, 150, 0, Math.PI * 2); ctx.fill();
            }

            elementsRef.current.forEach(el => {
                if (gravityEnabled) { el.vy -= 0.4; el.vx *= 0.98; }
                else { el.vy *= 0.95; el.vx *= 0.95; el.y += Math.sin(Date.now() * 0.001 + el.x) * 0.15; }

                const dx = el.x - mouseRef.current.x; const dy = el.y - mouseRef.current.y; const dist = Math.hypot(dx, dy);
                if (dist < 150) {
                    const force = (150 - dist) * 0.08;
                    const angle = Math.atan2(dy, dx);
                    el.vx += Math.cos(angle) * force; el.vy += Math.sin(angle) * force;
                }

                el.x += el.vx; el.y += el.vy; el.rotation += el.rotSpeed; el.rotSpeed *= 0.98;

                if (el.y < 0 || el.y > canvas.height) el.vy *= -0.7;
                if (el.x < 0 || el.x > canvas.width) el.vx *= -0.7;
                el.x = Math.max(0, Math.min(canvas.width, el.x));
                el.y = Math.max(0, Math.min(canvas.height, el.y));

                ctx.save(); ctx.translate(el.x, el.y); ctx.rotate(el.rotation);
                ctx.fillStyle = el.color; ctx.beginPath();
                const s = el.size / 2;
                ctx.moveTo(-s + 10, -s); ctx.lineTo(s - 10, -s); ctx.quadraticCurveTo(s, -s, s, -s + 10);
                ctx.lineTo(s, s - 10); ctx.quadraticCurveTo(s, s, s - 10, s);
                ctx.lineTo(-s + 10, s); ctx.quadraticCurveTo(-s, s, -s, s - 10);
                ctx.lineTo(-s, -s + 10); ctx.quadraticCurveTo(-s, -s, -s + 10, -s);
                ctx.fill(); ctx.restore();
            });
            animRef.current = requestAnimationFrame(step);
        };
        animRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animRef.current);
    }, [gravityEnabled]);

    useEffect(() => {
        const onMove = (e) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; mouseRef.current.active = true; };
        const onLeave = () => { mouseRef.current.active = false; };
        window.addEventListener('mousemove', onMove); window.addEventListener('mouseleave', onLeave);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default PhysicsBackground;
