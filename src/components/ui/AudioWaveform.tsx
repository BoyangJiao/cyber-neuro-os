import { motion, useAnimationFrame, useMotionValue, useSpring } from 'framer-motion';
import clsx from 'clsx';
import { useMusicStore } from '../../store/useMusicStore';
import { useEffect, useRef } from 'react';

interface AudioWaveformProps {
    isPlaying: boolean;
    className?: string;
    barColor?: string;
}

const BARS_COUNT = 5;
const MIN_HEIGHT = 4;
const MAX_ADDITIONAL_HEIGHT = 14;
// Total max height = 18px

// A single bar component that reads from its own spring value
const WaveformBar = ({ heightSpring, barColor, defaultHeight }: { heightSpring: any, barColor: string, defaultHeight: number }) => {
    return (
        <motion.div
            className={clsx("w-0.5 rounded-full", barColor)}
            style={{
                height: heightSpring,
                minHeight: `${MIN_HEIGHT}px`
            }}
            initial={{ height: defaultHeight }} // Avoid layout shift on load
        />
    );
};

export const AudioWaveform = ({ isPlaying, className, barColor = "bg-current" }: AudioWaveformProps) => {
    const { analyser } = useMusicStore();

    // Arrays to hold motion values and springs for each of the 5 bars
    const heights = useRef(Array.from({ length: BARS_COUNT }, () => useMotionValue(MIN_HEIGHT))).current;

    // Fast decay, highly responsive spring for realistic EQ feel
    const springConfig = { damping: 12, stiffness: 200, mass: 0.1 };
    const springHeights = useRef(heights.map(h => useSpring(h, springConfig))).current;

    const dataArray = useRef<Uint8Array | null>(null);

    // Initialize the typed array when analyser becomes available
    useEffect(() => {
        if (analyser && !dataArray.current) {
            dataArray.current = new Uint8Array(analyser.frequencyBinCount);
        }
    }, [analyser]);

    useAnimationFrame((time) => {
        // If playing and we have the analyzer, read real frequency data
        if (isPlaying && analyser && dataArray.current) {
            analyser.getByteFrequencyData(dataArray.current as any);

            // We divide into 5 distinct frequency bands:
            // 0: Bass, 1: Low-Mid, 2: Mid, 3: High-Mid, 4: Treble
            const bands = [
                dataArray.current.subarray(1, 3),   // 0: Bass
                dataArray.current.subarray(3, 6),   // 1: Low-Mid
                dataArray.current.subarray(6, 12),  // 2: Mid
                dataArray.current.subarray(12, 19), // 3: High-Mid
                dataArray.current.subarray(19, 31)  // 4: Treble
            ];

            // Re-map the bands to the UI bars to create a "Center = Low, Edges = High" pyramid layout.
            // Screen mapping (Left to Right):
            // Bar 0 (Far Left): High-Mid (Band 3)
            // Bar 1 (Inner Left): Low-Mid (Band 1)
            // Bar 2 (Center): Bass (Band 0)
            // Bar 3 (Inner Right): Mid (Band 2)
            // Bar 4 (Far Right): Treble (Band 4)
            // This ensures uniqueness per bar while maintaining the frequency-to-center symmetry aesthetics.
            const uiToBandMap = [3, 1, 0, 2, 4];

            // Manual sensitivity weighting to boost the edges (Treble / High-Mid)
            // Center bass has natural high energy, so weight is 1.0. Edges get a boost so they jump higher.
            const customWeights = [
                1.3, // Far Left (High-Mid) - Boosted
                1.0, // Inner Left (Low-Mid)
                1.0, // Center (Bass)
                1.0, // Inner Right (Mid)
                1.4  // Far Right (Treble) - Highly Boosted for high-hat sensitivity
            ];

            for (let i = 0; i < BARS_COUNT; i++) {
                const bandIndex = uiToBandMap[i];
                const band = bands[bandIndex];

                let sum = 0;
                for (let j = 0; j < band.length; j++) {
                    sum += band[j];
                }
                const average = sum / band.length;

                // Divisors to normalize incoming energy (Bass is naturally loud, treble is quiet)
                const divisors = [220, 180, 160, 140, 120];
                const divisor = divisors[bandIndex];

                // Map to 0.0 - 1.0 (clamped)
                let normalizedForce = Math.min(1, Math.max(0, average / divisor));

                // Apply our visual multiplier weights and re-clamp
                normalizedForce = Math.min(1, normalizedForce * customWeights[i]);

                // Apply a slight exponential curve for punchiness
                const punchyForce = Math.pow(normalizedForce, 1.5);

                const targetHeight = MIN_HEIGHT + (punchyForce * MAX_ADDITIONAL_HEIGHT);

                heights[i].set(targetHeight);
            }
        } else if (isPlaying) {
            // Fake visualizer mathematical formula
            const timeNum = time / 1000;
            const fakeUiToBandMap = [3, 1, 0, 2, 4];

            for (let i = 0; i < BARS_COUNT; i++) {
                const bandIndex = fakeUiToBandMap[i];
                const frequency = 2 + bandIndex * 1.5;
                const phase = i * 0.5;
                const wave = Math.sin(timeNum * frequency + phase) * 0.5 + 0.5;
                const spike = Math.random() > 0.95 ? Math.random() : 0;

                const boost = (i === 0 || i === 4) ? 1.2 : 1.0;
                const combined = Math.min(1, (wave * 0.8 + spike * 0.5) * boost);

                const fakeHeight = MIN_HEIGHT + (combined * MAX_ADDITIONAL_HEIGHT);
                heights[i].set(fakeHeight);
            }
        } else {
            // Idle breathing
            for (let i = 0; i < BARS_COUNT; i++) {
                const idleAdd = (Math.sin(time / 800 + i * 0.1) * 0.5 + 0.5) * 1.5;
                heights[i].set(MIN_HEIGHT + idleAdd);
            }
        }
    });

    return (
        <div className={clsx("flex items-center justify-center gap-[3px] h-5 w-6", className)}>
            {springHeights.map((spring, i) => (
                <WaveformBar
                    key={i}
                    heightSpring={spring}
                    barColor={barColor}
                    defaultHeight={MIN_HEIGHT}
                />
            ))}
        </div>
    );
};
