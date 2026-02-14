/**
 * ComparisonSlider - Before/After 对比滑块
 * 
 * 可复用组件，支持图片和视频的任意组合。
 * 拖拽滑块查看 Before/After 对比效果。
 * 
 * - 默认滑块位于 50%
 * - 向右拖动：展示更多 Before，超过 50% 暂停 After 视频
 * - 向左拖动：展示更多 After，播放 After 视频
 */
import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ComparisonSliderProps {
    beforeSrc: string;
    beforeType: 'image' | 'video';
    afterSrc: string;
    afterType: 'image' | 'video';
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
}

export const ComparisonSlider = ({
    beforeSrc,
    beforeType,
    afterSrc,
    afterType,
    beforeLabel = 'BEFORE',
    afterLabel = 'AFTER',
    className = '',
}: ComparisonSliderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const beforeVideoRef = useRef<HTMLVideoElement>(null);
    const afterVideoRef = useRef<HTMLVideoElement>(null);
    const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Control video playback based on slider position
    // Videos are PAUSED at 50% default. Only play when their visible area > 50%.
    useEffect(() => {
        // Before video: plays when slider > 50 (before side > 50% visible)
        if (beforeType === 'video' && beforeVideoRef.current) {
            if (sliderPos > 50) {
                beforeVideoRef.current.play().catch(() => { });
            } else {
                beforeVideoRef.current.pause();
            }
        }
        // After video: plays when slider < 50 (after side > 50% visible)
        if (afterType === 'video' && afterVideoRef.current) {
            if (sliderPos < 50) {
                afterVideoRef.current.play().catch(() => { });
            } else {
                afterVideoRef.current.pause();
            }
        }
    }, [sliderPos, beforeType, afterType]);

    const updateSliderPosition = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPos(percentage);
    }, []);

    // Mouse events
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        updateSliderPosition(e.clientX);
    }, [updateSliderPosition]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        updateSliderPosition(e.clientX);
    }, [isDragging, updateSliderPosition]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Touch events
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setIsDragging(true);
        updateSliderPosition(e.touches[0].clientX);
    }, [updateSliderPosition]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        updateSliderPosition(e.touches[0].clientX);
    }, [isDragging, updateSliderPosition]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Global mouse/touch listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    const renderMedia = (
        src: string,
        type: 'image' | 'video',
        ref: React.RefObject<HTMLVideoElement | null>,
        label: string
    ) => {
        if (type === 'video') {
            return (
                <video
                    ref={ref}
                    src={src}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    aria-label={label}
                />
            );
        }
        return (
            <img
                src={src}
                alt={label}
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
            />
        );
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full aspect-video overflow-hidden rounded-lg cursor-col-resize select-none ${className}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ touchAction: 'none' }}
        >
            {/* After layer (bottom / full width) */}
            <div className="absolute inset-0">
                {renderMedia(afterSrc, afterType, afterVideoRef, afterLabel)}
            </div>

            {/* Before layer (top / clipped by slider) */}
            <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                {renderMedia(beforeSrc, beforeType, beforeVideoRef, beforeLabel)}
            </div>

            {/* Slider handle */}
            <div
                className="absolute top-0 bottom-0 z-10"
                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
                {/* Vertical line */}
                <div className="absolute inset-y-0 w-[2px] bg-[var(--color-brand-primary)] shadow-[0_0_8px_var(--color-brand-primary)]" />

                {/* Drag handle */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-[var(--color-brand-primary)] bg-black/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_12px_var(--color-brand-primary)]"
                    animate={{
                        scale: isDragging ? 1.2 : isHovering ? 1.05 : 1,
                        boxShadow: isDragging
                            ? '0 0 20px var(--color-brand-primary)'
                            : '0 0 12px var(--color-brand-primary)',
                    }}
                    transition={{ duration: 0.15 }}
                >
                    {/* Arrows */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[var(--color-brand-primary)]">
                        <path d="M6 10L3 7M3 7L6 4M3 7H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 10L17 13M17 13L14 16M17 13H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>
            </div>

            {/* Labels */}
            <motion.div
                className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-[var(--color-border-subtle)] font-mono text-xs tracking-widest uppercase text-[var(--color-text-secondary)]"
                animate={{ opacity: isHovering || isDragging ? 1 : 0.6 }}
            >
                {beforeLabel}
            </motion.div>
            <motion.div
                className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-[var(--color-border-subtle)] font-mono text-xs tracking-widest uppercase text-[var(--color-brand-primary)]"
                animate={{ opacity: isHovering || isDragging ? 1 : 0.6 }}
            >
                {afterLabel}
            </motion.div>
        </div>
    );
};
