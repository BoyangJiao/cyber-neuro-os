/**
 * AmbientBackground - Layered atmospheric effects
 * 
 * Layer 3: Slow-moving ambient light orbs (CSS animated)
 *   - Inspired by Death Stranding's chiral atmosphere and
 *     Cyberpunk 2077's ambient neon bleed through fog
 *   - Large, heavily blurred radial gradients that drift slowly
 * 
 * Layer 4: Edge data streams + floating micro-particles (Canvas)
 *   - Cyberpunk 2077 HUD edge data columns
 *   - Matrix-style vertical character rain on margins only
 *   - Sparse floating dust particles for depth
 */
import { useEffect, useRef, memo } from 'react';

// ============================================================
// LAYER 4: Data Rain + Micro Particles (Canvas)
// ============================================================

interface DataColumn {
    x: number;
    chars: string[];
    speed: number;
    headY: number;
    trailLength: number;
    fontSize: number;
    opacity: number;
    delay: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    maxOpacity: number;
    life: number;
    maxLife: number;
}

const GLYPHS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF∷∴∵≡≢∞⊕⊗⊘⊙';

const getRandomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

const DataRainCanvas = memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const columnsRef = useRef<DataColumn[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Read brand color from CSS custom properties
        const computedStyle = getComputedStyle(document.documentElement);
        const brandPrimary = computedStyle.getPropertyValue('--color-brand-primary').trim() || '#00F0FF';

        const MARGIN_WIDTH = 80; // px - data rain zone on each edge
        const MAX_PARTICLES = 30;

        // Track previous dimensions for proportional remapping
        let prevW = window.innerWidth;
        let prevH = window.innerHeight;

        // Resize canvas dimensions only — does NOT reinitialize data
        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;

            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            // Reset transform to avoid cumulative scaling
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            return { w, h };
        };

        const initColumns = () => {
            const columns: DataColumn[] = [];
            const w = window.innerWidth;
            const h = window.innerHeight;

            // Left edge columns — x is absolute from left
            for (let x = 8; x < MARGIN_WIDTH; x += 14 + Math.random() * 10) {
                columns.push({
                    x,
                    chars: Array.from({ length: 20 + Math.floor(Math.random() * 15) }, getRandomGlyph),
                    speed: 0.3 + Math.random() * 0.6,
                    headY: -Math.random() * h * 2,
                    trailLength: 8 + Math.floor(Math.random() * 12),
                    fontSize: 9 + Math.floor(Math.random() * 3),
                    opacity: 0.08 + Math.random() * 0.12,
                    delay: Math.random() * 3000,
                });
            }

            // Right edge columns — store as offset from right edge
            for (let offset = 8; offset < MARGIN_WIDTH; offset += 14 + Math.random() * 10) {
                columns.push({
                    x: w - offset, // will be recalculated on resize
                    chars: Array.from({ length: 20 + Math.floor(Math.random() * 15) }, getRandomGlyph),
                    speed: 0.3 + Math.random() * 0.6,
                    headY: -Math.random() * h * 2,
                    trailLength: 8 + Math.floor(Math.random() * 12),
                    fontSize: 9 + Math.floor(Math.random() * 3),
                    opacity: 0.08 + Math.random() * 0.12,
                    delay: Math.random() * 3000,
                });
            }

            columnsRef.current = columns;
        };

        const initParticles = () => {
            const particles: Particle[] = [];
            const w = window.innerWidth;
            const h = window.innerHeight;

            for (let i = 0; i < MAX_PARTICLES; i++) {
                particles.push(createParticle(w, h));
            }
            particlesRef.current = particles;
        };

        const createParticle = (w: number, h: number): Particle => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.15,
            vy: -0.05 - Math.random() * 0.15, // slow upward drift
            size: 0.5 + Math.random() * 1.5,
            opacity: 0,
            maxOpacity: 0.1 + Math.random() * 0.2,
            life: 0,
            maxLife: 5000 + Math.random() * 10000,
        });

        // Handle resize: adapt existing elements to new dimensions
        const handleResize = () => {
            const { w, h } = resizeCanvas();
            const scaleX = w / prevW;
            const scaleY = h / prevH;

            // Adapt right-side columns to follow the new right edge
            columnsRef.current.forEach(col => {
                if (col.x > prevW / 2) {
                    // Right-side column: maintain offset from right edge
                    const offsetFromRight = prevW - col.x;
                    col.x = w - offsetFromRight;
                }
                // Left-side columns stay as-is (absolute from left)
            });

            // Proportionally remap particle positions
            particlesRef.current.forEach(p => {
                p.x *= scaleX;
                p.y *= scaleY;
            });

            prevW = w;
            prevH = h;
        };

        // Animation loop
        const animate = (timestamp: number) => {
            const dt = Math.min(timestamp - timeRef.current, 100); // cap dt to prevent jumps
            timeRef.current = timestamp;
            const w = window.innerWidth;
            const h = window.innerHeight;

            ctx.clearRect(0, 0, w, h);

            // --- Draw data rain columns ---
            columnsRef.current.forEach(col => {
                if (timestamp < col.delay) return;

                col.headY += col.speed;
                const lineHeight = col.fontSize * 1.3;

                // Reset when entire trail passes bottom
                if ((col.headY - col.trailLength * lineHeight) > h) {
                    col.headY = -Math.random() * h * 0.5;
                    col.delay = timestamp + Math.random() * 2000;
                    // Refresh some chars
                    for (let i = 0; i < col.chars.length; i++) {
                        if (Math.random() > 0.7) col.chars[i] = getRandomGlyph();
                    }
                }

                ctx.font = `${col.fontSize}px "Share Tech Mono", monospace`;
                ctx.textAlign = 'center';

                for (let i = 0; i < col.trailLength; i++) {
                    const y = col.headY - i * lineHeight;
                    if (y < -lineHeight || y > h + lineHeight) continue;

                    const charIdx = Math.floor(col.headY / lineHeight + i) % col.chars.length;
                    const char = col.chars[Math.abs(charIdx)];

                    // Fade: head is brightest, trail fades
                    const trailFade = 1 - (i / col.trailLength);
                    const alpha = col.opacity * trailFade * trailFade;

                    if (i === 0) {
                        // Head character - brighter, slightly larger
                        ctx.fillStyle = brandPrimary;
                        ctx.globalAlpha = Math.min(alpha * 3, 0.5);
                    } else {
                        ctx.fillStyle = brandPrimary;
                        ctx.globalAlpha = alpha;
                    }

                    ctx.fillText(char, col.x, y);
                }

                // Randomly mutate one character in the trail
                if (Math.random() > 0.95) {
                    const idx = Math.floor(Math.random() * col.chars.length);
                    col.chars[idx] = getRandomGlyph();
                }
            });

            // --- Draw floating particles ---
            particlesRef.current.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life += dt;

                // Fade in/out lifecycle
                const lifeRatio = p.life / p.maxLife;
                if (lifeRatio < 0.1) {
                    p.opacity = p.maxOpacity * (lifeRatio / 0.1);
                } else if (lifeRatio > 0.8) {
                    p.opacity = p.maxOpacity * (1 - (lifeRatio - 0.8) / 0.2);
                } else {
                    p.opacity = p.maxOpacity;
                }

                // Reset dead particles
                if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > w + 10) {
                    particlesRef.current[i] = createParticle(w, h);
                    particlesRef.current[i].y = h + 5; // Start from bottom
                    return;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = brandPrimary;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            });

            ctx.globalAlpha = 1;
            animFrameRef.current = requestAnimationFrame(animate);
        };

        // Initial setup: create canvas + data, then start animation
        resizeCanvas();
        initColumns();
        initParticles();
        animFrameRef.current = requestAnimationFrame(animate);

        // Resize only adapts — does NOT reinitialize
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
            aria-hidden="true"
        />
    );
});

DataRainCanvas.displayName = 'DataRainCanvas';


// ============================================================
// MAIN EXPORT: Combined ambient background
// ============================================================

export const AmbientBackground = memo(() => {
    return (
        <>
            {/* Layer 3: Ambient Light Orbs (CSS animated) */}
            <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden" aria-hidden="true">
                {/* Primary orb - slow drift upper-right to lower-left */}
                <div
                    className="absolute w-[600px] h-[600px] rounded-full opacity-[0.025] blur-[120px] animate-[orb-drift-1_25s_ease-in-out_infinite]"
                    style={{
                        background: 'radial-gradient(circle, var(--color-brand-primary), transparent 70%)',
                        top: '10%',
                        right: '15%',
                    }}
                />
                {/* Secondary orb - counter-drift lower-left to upper-right */}
                <div
                    className="absolute w-[500px] h-[500px] rounded-full opacity-[0.02] blur-[100px] animate-[orb-drift-2_30s_ease-in-out_infinite]"
                    style={{
                        background: 'radial-gradient(circle, var(--color-brand-secondary), transparent 70%)',
                        bottom: '20%',
                        left: '10%',
                    }}
                />
                {/* Tertiary orb - subtle vertical pulse */}
                <div
                    className="absolute w-[400px] h-[800px] rounded-full opacity-[0.015] blur-[150px] animate-[orb-drift-3_20s_ease-in-out_infinite]"
                    style={{
                        background: 'radial-gradient(ellipse, var(--color-brand-primary), transparent 60%)',
                        top: '30%',
                        left: '40%',
                    }}
                />
            </div>

            {/* Layer 4: Data Rain + Particles (Canvas) */}
            <DataRainCanvas />
        </>
    );
});

AmbientBackground.displayName = 'AmbientBackground';
