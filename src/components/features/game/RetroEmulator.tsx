import { useRef, useState } from 'react';
import { ChamferFrame } from '../../ui/frames/ChamferFrame';
import { ShimmerLoader } from '../../ui/loading/ShimmerLoader';
import { twMerge } from 'tailwind-merge';
interface RetroEmulatorProps {
    gameUrl: string;
    gameName?: string;
    core?: string;
    className?: string;
}

/**
 * RetroEmulator
 * 
 * Embeds EmulatorJS inside an iframe, wrapped in the Cyber OS aesthetic.
 */
export const RetroEmulator = ({
    gameUrl,
    gameName = 'Retro Game',
    core = 'gba',
    className
}: RetroEmulatorProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Build the iframe URL
    const emulatorUrl = new URL(
        '/emulator.html',
        window.location.origin
    );
    emulatorUrl.searchParams.set('gameUrl', gameUrl);
    emulatorUrl.searchParams.set('core', core);
    emulatorUrl.searchParams.set('gameName', gameName);

    return (
        <div className={twMerge("w-full h-full relative flex flex-col items-center justify-center", className)}>
            <ChamferFrame
                chamferSize={16}
                className="w-full h-full p-0 overflow-hidden bg-black/60 shadow-glow"
                showEffects={false}
                disableHover={true}
            >
                <div className="relative w-full h-full">
                    {/* Retro Scanner / CRT Overlay could go here if we want to overlay the iframe */}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
                            <ShimmerLoader
                                show={true}
                                variant="overlay"
                                label={`LOADING ${gameName} [${core.toUpperCase()}] MATRIX...`}
                            />
                        </div>
                    )}

                    {/* Emulator Iframe */}
                    <iframe
                        ref={iframeRef}
                        src={emulatorUrl.toString()}
                        className="w-full h-full border-none outline-none relative z-0"
                        allow="autoplay; gamepad; fullscreen"
                        onLoad={() => setIsLoading(false)}
                    />

                    {/* Operational Overlay / Control Guide */}
                    {!isLoading && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] md:text-xs text-text-primary px-4 py-2 rounded border border-border-default z-[20] pointer-events-none opacity-50 flex items-center gap-4 md:gap-6 whitespace-nowrap shadow-md">
                            <span className="text-status-error font-bold tracking-widest flex items-center gap-1 animate-pulse">
                                <i className="ri-mouse-line"></i> CLICK GAME TO COMMLINK
                            </span>
                            <span className="text-text-secondary">|</span>
                            <span className="tracking-widest"><span className="text-brand-primary">ENTER:</span> START</span>
                            <span className="tracking-widest"><span className="text-brand-primary">Z/X:</span> B/A</span>
                            <span className="tracking-widest"><span className="text-brand-primary">ARROWS:</span> D-PAD</span>
                        </div>
                    )}
                </div>
            </ChamferFrame>
        </div>
    );
};
