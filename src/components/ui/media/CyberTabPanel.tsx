/**
 * CyberTabPanel - Cyberpunk-styled Tab/Segment Control
 * 
 * 通用标签面板组件，支持图片和视频。
 * 每个 Tab 可包含一张图片或一段视频。
 * 
 * 赛博朋克风格：发光指示器、滑动动画、深色面板。
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlFor } from '../../../sanity/client';
import type { TabItem } from '../../../data/projectDetails';

interface CyberTabPanelProps {
    tabs: TabItem[];
    className?: string;
}

export const CyberTabPanel = ({ tabs, className = '' }: CyberTabPanelProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    // Update indicator position when active tab changes
    const updateIndicator = useCallback(() => {
        const activeTab = tabRefs.current[activeIndex];
        if (activeTab) {
            const container = activeTab.parentElement;
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const tabRect = activeTab.getBoundingClientRect();
                setIndicatorStyle({
                    left: tabRect.left - containerRect.left,
                    width: tabRect.width,
                });
            }
        }
    }, [activeIndex]);

    useEffect(() => {
        updateIndicator();
        window.addEventListener('resize', updateIndicator);
        return () => window.removeEventListener('resize', updateIndicator);
    }, [updateIndicator]);

    if (!tabs || tabs.length === 0) return null;

    const activeTab = tabs[activeIndex];

    // Resolve media source
    const resolveMedia = (tab: TabItem) => {
        const videoUrl = tab.videoFile?.asset?.url || tab.video;
        const imageUrl = tab.image ? urlFor(tab.image).auto('format').quality(90).url() : undefined;
        return {
            src: videoUrl || imageUrl,
            type: (videoUrl ? 'video' : 'image') as 'video' | 'image',
        };
    };

    const media = resolveMedia(activeTab);

    return (
        <div className={`w-full ${className}`}>
            {/* Tab Header Bar */}
            <div className="relative flex items-stretch bg-black/40 border border-[var(--color-border-subtle)] rounded-t-lg overflow-hidden backdrop-blur-sm">
                {/* Sliding Indicator */}
                <motion.div
                    className="absolute bottom-0 h-[2px] bg-[var(--color-brand-primary)]"
                    style={{ boxShadow: '0 0 8px var(--color-brand-primary)' }}
                    animate={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />

                {tabs.map((tab, index) => (
                    <button
                        key={tab._key}
                        ref={(el) => { tabRefs.current[index] = el; }}
                        onClick={() => setActiveIndex(index)}
                        className={`
                            relative flex-1 px-4 py-3 font-mono text-xs tracking-[0.2em] uppercase
                            transition-colors duration-200 cursor-pointer
                            ${activeIndex === index
                                ? 'text-[var(--color-brand-primary)]'
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                            }
                        `}
                    >
                        {/* Active glow background */}
                        {activeIndex === index && (
                            <motion.div
                                className="absolute inset-0 bg-[var(--color-brand-primary)]/5"
                                layoutId="tab-glow"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="relative w-full aspect-video overflow-hidden rounded-b-lg border border-t-0 border-[var(--color-border-subtle)] bg-black/20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        {media.src && media.type === 'video' ? (
                            <video
                                key={media.src}
                                src={media.src}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                className="w-full h-full object-cover"
                            />
                        ) : media.src ? (
                            <img
                                src={media.src}
                                alt={activeTab.label}
                                className="w-full h-full object-cover"
                                draggable={false}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)] font-mono text-sm">
                                NO MEDIA
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
