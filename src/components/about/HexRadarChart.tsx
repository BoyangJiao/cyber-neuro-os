import { motion } from 'framer-motion';

interface HexRadarChartProps {
    data: number[]; // 6 values from 0 to 100
    labels: string[]; // 6 labels
    className?: string;
}

export const HexRadarChart = ({ data, labels, className = '' }: HexRadarChartProps) => {
    // 6-point radar
    const sides = 6;
    const centerX = 150;
    const centerY = 150;
    const radius = 100;

    // Calculate coordinates for a given radius and point index
    const getPoint = (r: number, index: number) => {
        // Start from top (index 0) and go clockwise
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / sides;
        return {
            x: centerX + r * Math.cos(angle),
            y: centerY + r * Math.sin(angle)
        };
    };

    // Background web polygons
    const webLevels = [0.25, 0.5, 0.75, 1];
    const webPolygons = webLevels.map(level => {
        const points = Array.from({ length: sides }).map((_, i) => {
            const p = getPoint(radius * level, i);
            return `${p.x},${p.y}`;
        }).join(' ');
        return points;
    });

    // Data polygon
    const dataPoints = data.map((value, i) => {
        const r = radius * (value / 100);
        const p = getPoint(r, i);
        return `${p.x},${p.y}`;
    }).join(' ');

    return (
        <div className={`relative w-full max-w-[400px] aspect-square flex items-center justify-center ${className}`}>
            <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                {/* Background Web */}
                {webPolygons.map((points, i) => (
                    <polygon
                        key={`web-${i}`}
                        points={points}
                        fill="none"
                        stroke="rgba(0, 255, 255, 0.15)"
                        strokeWidth="1"
                    />
                ))}

                {/* Web diagonal lines */}
                {Array.from({ length: sides / 2 }).map((_, i) => {
                    const p1 = getPoint(radius, i);
                    const p2 = getPoint(radius, i + 3);
                    return (
                        <line
                            key={`line-${i}`}
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke="rgba(0, 255, 255, 0.15)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon with Framer Motion */}
                <motion.polygon
                    initial={{ points: webPolygons[0], opacity: 0 }}
                    animate={{ points: dataPoints, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    fill="rgba(0, 255, 255, 0.2)"
                    stroke="var(--color-brand-primary)"
                    strokeWidth="2"
                    className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
                />

                {/* Data points */}
                {data.map((value, i) => {
                    const r = radius * (value / 100);
                    const p = getPoint(r, i);
                    return (
                        <motion.circle
                            key={`point-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r="4"
                            initial={{ r: 0, opacity: 0 }}
                            animate={{ r: 4, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.5 + i * 0.1 }}
                            fill="var(--color-brand-primary)"
                            className="drop-shadow-[0_0_4px_rgba(0,255,255,1)]"
                        />
                    );
                })}

                {/* Labels */}
                {labels.map((label, i) => {
                    // Position labels slightly outside the radius
                    const p = getPoint(radius + 25, i);
                    // Adjust text anchor based on position
                    let textAnchor: "middle" | "start" | "end" = "middle";
                    if (p.x < centerX - 10) textAnchor = "end";
                    if (p.x > centerX + 10) textAnchor = "start";

                    return (
                        <motion.text
                            key={`label-${i}`}
                            x={p.x}
                            y={p.y}
                            textAnchor={textAnchor}
                            alignmentBaseline="middle"
                            initial={{ opacity: 0, y: p.y + 10 }}
                            animate={{ opacity: 1, y: p.y }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                            className="text-[9px] uppercase tracking-widest font-mono fill-brand-primary/80"
                        >
                            {label}
                        </motion.text>
                    );
                })}
            </svg>
        </div>
    );
};
