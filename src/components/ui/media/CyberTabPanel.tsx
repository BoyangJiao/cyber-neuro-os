/**
 * CyberTabPanel - Cyberpunk-styled Tab/Segment Control
 * 
 * 通用标签面板组件，支持图片和视频。
 * 每个 Tab 可包含一张图片或一段视频。
 * 
 * 赛博朋克风格：发光指示器、滑动动画、深色面板。
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlFor } from '../../../sanity/client';
import type { TabItem } from '../../../data/projectDetails';

interface CyberTabPanelProps {
    tabs: TabItem[];
    className?: string;
}

const getTabIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes('before')) return 'ri-history-line';
    if (lower.includes('after')) return 'ri-magic-line';
    if (lower.includes('design') || lower.includes('ui')) return 'ri-pen-nib-line';
    if (lower.includes('code') || lower.includes('dev')) return 'ri-code-box-line';
    if (lower.includes('wireframe')) return 'ri-layout-wireframe-line';
    return 'ri-image-2-line';
};

export const CyberTabPanel = ({ tabs, className = '' }: CyberTabPanelProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

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
        <div className={`w-full flex flex-col gap-3 py-4 ${className}`}>
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                {/* Generic Title */}
                <div className="flex items-center gap-2 px-2">
                    <i className="ri-folder-video-line text-[var(--color-brand-primary)]"></i>
                    <span className="font-mono text-xs tracking-widest text-[var(--color-text-secondary)] uppercase">
                        Interactive Media
                    </span>
                    <div className="h-[1px] w-12 bg-gradient-to-r from-[var(--color-brand-primary)]/50 to-transparent ml-2 hidden sm:block" />
                </div>

                {/* Segmented Tabs */}
                <div className="relative flex items-stretch bg-black/60 border border-[var(--color-border-subtle)] rounded-md p-1 backdrop-blur-md self-start sm:self-auto">
                    {tabs.map((tab, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <button
                                key={tab._key}
                                onClick={() => setActiveIndex(index)}
                                className={`
                                    relative px-5 py-2 font-mono text-xs tracking-[0.15em] uppercase
                                    transition-colors duration-200 cursor-pointer rounded-sm z-10 flex items-center justify-center gap-2
                                    ${isActive
                                        ? 'text-black font-bold'
                                        : 'text-[var(--color-text-secondary)] hover:text-white'
                                    }
                                `}
                            >
                                {/* Active pill indicator */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 bg-[var(--color-brand-primary)] shadow-[0_0_12px_var(--color-brand-primary)] rounded-sm"
                                        layoutId={`tab-pill-${tabs[0]._key}`} // Use first tab's key as id anchor to prevent global layout ID collisions if multiple panels exist
                                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                        style={{ zIndex: -1 }}
                                    />
                                )}
                                <i className={`${getTabIcon(tab.label)} ${isActive ? 'text-black' : 'text-[var(--color-brand-primary)]/70'}`}></i>
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-black/20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)] font-mono text-xs tracking-widest gap-2">
                                <i className="ri-image-line text-2xl opacity-50"></i>
                                NO MEDIA FOUND
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
