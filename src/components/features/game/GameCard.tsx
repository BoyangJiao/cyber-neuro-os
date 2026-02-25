import type { Game } from '../../../data/games';
import { useTranslation } from '../../../i18n';
import { ChamferFrame } from '../../ui/frames/ChamferFrame';
import { PixelGridEffect, ScanlineEffect } from '../../ui/effects';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
    game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex flex-col items-center group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate(`/games/${game.id}`)}
        >
            <ChamferFrame
                chamferSize={0}
                className="w-full aspect-[16/10] overflow-hidden mb-3 border border-border-subtle group-hover:border-status-error transition-colors duration-300"
                bgClassName="bg-bg-surface"
                showEffects={false}
            >
                <div className="relative w-full h-full">
                    {/* Placeholder or generated image */}
                    <div className="w-full h-full bg-bg-surface-2 flex items-center justify-center overflow-hidden">
                        <img
                            src={game.image}
                            alt={t(game.titleKey)}
                            className={twMerge(
                                "w-full h-full object-cover grayscale transition-all duration-500",
                                isHovered ? "grayscale-0 scale-105" : "grayscale opacity-70"
                            )}
                        />
                    </div>

                    <div className="absolute inset-0 pointer-events-none">
                        <PixelGridEffect active={isHovered} />
                        <ScanlineEffect active={isHovered} variant="flash" />
                    </div>
                </div>
            </ChamferFrame>

            <h3 className="text-sm font-display tracking-[0.2em] text-status-error mb-1 uppercase text-center transition-all duration-300 group-hover:tracking-[0.3em]">
                {t(game.titleKey)}
            </h3>
            <p className="text-[10px] font-mono tracking-wider text-text-muted uppercase text-center opacity-80">
                {t(game.descKey)}
            </p>
        </div>
    );
};
