import { twMerge } from 'tailwind-merge';

export interface PCBTraceEffectProps {
    /** Whether the effect is active (e.g. hover state) */
    active?: boolean;
    /** Current scan progress (0-100) */
    scanProgress?: number;
    /** Additional classes */
    className?: string;
}

/**
 * PCBTraceEffect - Printed Circuit Board Traces Background
 * 
 * Logic:
 * - Renders a static "dim" layer of traces.
 * - Renders a "lit" layer of traces revealed by the scanline.
 * - Splits traces into "primary" (synced) and "secondary" (lagging) groups for visual complexity.
 * - Nodes (circles) have a breathing animation.
 */
export const PCBTraceEffect = ({
    active = false,
    scanProgress = 0,
    className,
}: PCBTraceEffectProps) => {
    // Calculate draw progress (inverse of scan progress, as dashoffset 1->0 draws the line)
    // Primary draws directly with scan progress
    // Map 0-100 scanProgress to 1-0 offset
    const primaryOffset = 1 - (scanProgress / 100);

    // Secondary lags: starts later, finishes at same time
    // Formula: (scanProgress * 1.18) - 18 maps 0 -> -18 (clamped to 0), 100 -> 100.
    // Normalized to 0-1 range for offset calculation
    const lagVal = Math.max(0, (scanProgress * 1.18) - 18);
    const secondaryOffset = 1 - (lagVal / 100);

    // Only show lit effect if active or scanning
    const isLit = active || scanProgress > 0;

    return (
        <div className={twMerge("absolute inset-0 pointer-events-none mix-blend-screen", className)}>
            <svg
                className="w-full h-full"
                viewBox="0 0 210 307"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                {/* 1. Base Layer: Dim / Unpowered Traces (Visible but faint) */}
                <g className="stroke-white/30" strokeWidth="0.5">
                    {/* All Paths combined for background */}
                    <Paths />
                </g>

                {/* 2. Lit Layer: High Energy Traces (Flowing from outside in) */}
                <g
                    className={twMerge(
                        "stroke-[var(--color-brand-secondary)] filter drop-shadow-[0_0_2px_var(--color-brand-secondary)] transition-opacity duration-300",
                        isLit ? "opacity-100" : "opacity-0"
                    )}
                    strokeWidth="0.8"
                    // Important: Set pathLength to 1 for all paths to normalize animation
                    // strokeDasharray="1" means the dash is the length of the path
                    strokeDasharray="1"
                >
                    {/* Primary Group: Synced with Scanline */}
                    <g style={{ strokeDashoffset: primaryOffset }}>
                        <PrimaryPaths />
                    </g>

                    {/* Secondary Group: Lagging Flow */}
                    <g style={{ strokeDashoffset: secondaryOffset }}>
                        <SecondaryPaths />
                    </g>
                </g>

                {/* 3. Nodes: Breathing Circles */}
                <g
                    className={twMerge(
                        "fill-white transition-opacity duration-500",
                        isLit ? "opacity-90 animate-pulse" : "opacity-20"
                    )}
                >
                    <Circles />
                </g>
            </svg>
        </div>
    );
};

// --- Sub-components for Path Groups ---

const PrimaryPaths = () => (
    <>
        {/* Bottom Left 1 */}
        <path pathLength="1" d="M0 278.177H32.5L55 300.677V304.677M0 265.177H33.5L42 273.677V277.177L60.5 295.677V298.177M0 251.677H29L43 265.677M0 241.677H29L56 268.677V276.177L83 303.177V304.677" />
        {/* Top Right 1 */}
        <path pathLength="1" d="M155.5 0.176758V8.17676L167 19.6768H208.5M140 0.176758V9.17676L171.5 41.1768H208.5M131 0.176758V6.17676L161.5 36.6768V43.6768L181 63.1768H208.5M151.5 0.176758V7.67676L165.5 21.6768H208.5" />
    </>
);

const SecondaryPaths = () => (
    <>
        {/* Top Left 1 (Moved from Primary) */}
        <path pathLength="1" d="M0 50.1768H38.5L59 71.1768V79.6768M63 85.6768V69.6768L46 52.6768V32.1768L78 0.176758" />
        {/* Bottom Right 1 (Moved from Primary) */}
        <path pathLength="1" d="M209.5 255.677H171L150.5 234.677V226.177M146.5 220.177V236.177L163.5 253.177V273.677L131.5 305.677" />

        {/* Top Left 2 */}
        <path pathLength="1" d="M55 50.6768V27.1768L82 0.176758M59 44.6768V27.6768L86.5 0.176758M63 55.6768V27.6768L90.5 0.176758M0 45.6768H36M0 41.6768H39M35 36.6768H0M66 0.176758L39 27.1768H0M71 0.176758L40.5 30.6768H0" />
        {/* Bottom Right 2 */}
        <path pathLength="1" d="M154.5 255.177V278.677L127.5 305.677M150.5 261.177V278.177L123 305.677M146.5 250.177V278.177L119 305.677M209.5 260.177H173.5M143.5 305.677L170.5 278.677H209.5M138.5 305.677L169 275.177H209.5" />
        {/* Bottom Left 2 */}
        <path pathLength="1" d="M64 304.677L38.5 279.177V274.677L33 269.177H0M73.5 304.677V301.677L35.5 263.677H0M50.5 304.677V302.177L47 298.677M85.5 304.677V303.177L59 276.677V268.177L30 239.177H0M77 304.677V300.677L52 275.677" />
        {/* Top Right 2 */}
        <path pathLength="1" d="M208.5 51.1768H181.749M208.5 36.1768H176.5L150.5 10.1768M176 41.1768L167 32.1768M208.5 65.1768H178.5L158 44.6768V36.1768L128 6.17676V0.176758M161.5 36.6768V33.6768L136.5 8.67676V0.176758M171.5 41.1768H166.5" />
    </>
);

const Paths = () => (
    <>
        <PrimaryPaths />
        <SecondaryPaths />
    </>
);

const Circles = () => (
    <>
        {/* Top Left Circles */}
        <circle cx="36" cy="36.6768" r="1.25" />
        <circle cx="40" cy="41.6768" r="1.25" />
        <circle cx="55" cy="51.6768" r="1.25" />
        <circle cx="59" cy="45.6768" r="1.25" />
        <circle cx="63" cy="56.6768" r="1.25" />
        <circle cx="63" cy="86.6768" r="1.25" />
        <circle cx="59" cy="80.6768" r="1.25" />
        <circle cx="37" cy="45.6768" r="1.25" />

        {/* Bottom Right Circles */}
        <circle cx="154.5" cy="254.177" r="1.25" />
        <circle cx="150.5" cy="260.177" r="1.25" />
        <circle cx="146.5" cy="249.177" r="1.25" />
        <circle cx="146.5" cy="219.177" r="1.25" />
        <circle cx="150.5" cy="225.177" r="1.25" />
        <circle cx="172.5" cy="260.177" r="1.25" />

        {/* Bottom Left Circles */}
        <circle cx="44" cy="266.677" r="1.25" />
        <circle cx="51" cy="274.677" r="1.25" />
        <circle cx="46" cy="297.677" r="1.25" />

        {/* Top Right Circles */}
        <circle cx="149.5" cy="9.17676" r="1.25" />
        <circle cx="166.5" cy="31.1768" r="1.25" />
        <circle cx="165.5" cy="41.1768" r="1.25" />
        <circle cx="180.5" cy="51.1768" r="1.25" />
    </>
);
