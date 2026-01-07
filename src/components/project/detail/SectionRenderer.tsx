import { PortableText } from '@portabletext/react';
import { urlFor } from '../../../sanity/client';
import { MotionDiv } from '../../motion/MotionWrappers';


import type { SanityProjectModule } from '../../../data/projectDetails';

interface SectionRendererProps {
    module: SanityProjectModule;
    onVisible?: (id: string) => void;
}

export const SectionRenderer = ({ module, onVisible }: SectionRendererProps) => {
    // Generate a safe ID for navigation
    const sectionId = module.title.toLowerCase().replace(/\s+/g, '-');

    // Common animation props
    const viewportConfig = { once: false, margin: "-20% 0px -20% 0px" };

    // Use IntersectionObserver logic via onViewportEnter if needed, 
    // or just rely on parent scroll spy. 
    // For simplicity, we'll let the parent handle scroll spy via standard rendering,
    // but if we need precise triggering we can add it here.

    const handleViewportEnter = () => {
        onVisible?.(sectionId);
    };

    // Portable Text Components customization
    const ptComponents = {
        block: {
            normal: ({ children }: any) => <p className="text-lg text-neutral-300 leading-relaxed max-w-2xl">{children}</p>,
            h4: ({ children }: any) => <h4 className="text-xl font-display text-cyan-400 mb-4">{children}</h4>,
        },
        list: {
            bullet: ({ children }: any) => <ul className="list-disc pl-5 mb-4 text-neutral-300 space-y-2">{children}</ul>,
        },
    };

    const renderContent = () => (
        <div className="prose prose-invert max-w-none">
            <PortableText value={module.content} components={ptComponents} />
        </div>
    );

    const renderMedia = () => {
        if (!module.media) return null;
        return (
            <div className="relative rounded-lg overflow-hidden border border-cyan-500/20 bg-black/40">
                <img
                    src={urlFor(module.media).width(1200).url()}
                    alt={module.title}
                    className="w-full h-auto object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                />
                {/* Decorative Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>
        );
    };

    // --- Layout Variants ---

    if (module.layout === 'full-width') {
        return (
            <section
                id={sectionId}
                className="py-20 border-b border-cyan-900/10 min-h-[60vh] flex flex-col justify-center"
            >
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    onViewportEnter={handleViewportEnter}
                    className="w-full"
                >
                    <div className="mb-8">
                        <span className="text-xs font-mono text-cyan-500 tracking-widest uppercase mb-2 block">
                            {module.theme.toUpperCase()}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display text-white mb-6">
                            {module.title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                        {renderMedia()}
                        <div className="max-w-4xl mx-auto w-full">
                            {renderContent()}
                        </div>
                    </div>
                </MotionDiv>
            </section>
        );
    }

    if (module.layout === 'media-right') {
        return (
            <section
                id={sectionId}
                className="py-20 border-b border-cyan-900/10"
            >
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    onViewportEnter={handleViewportEnter}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                    <div>
                        <span className="text-xs font-mono text-cyan-500 tracking-widest uppercase mb-2 block">
                            {module.theme.toUpperCase()}
                        </span>
                        <h2 className="text-3xl font-display text-white mb-6">
                            {module.title}
                        </h2>
                        {renderContent()}
                    </div>
                    <div>
                        {renderMedia()}
                    </div>
                </MotionDiv>
            </section>
        );
    }

    // Default: Left Sidebar Style (Standard for this project)
    // Actually, the "sidebar" in the project is the HUD on the left.
    // So standard layout here means Content on the right, potentially with a small label on the left or just flow.
    // Given previous designs, we usually have a "Title" on the left and content on the right, or stacked.
    // Let's stick to the styling of NarrativeSection.tsx

    return (
        <section
            id={sectionId}
            className="py-20 border-b border-cyan-900/10"
        >
            <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportConfig}
                onViewportEnter={handleViewportEnter}
                className="grid grid-cols-1 md:grid-cols-12 gap-8"
            >
                {/* Section Header / Left Column */}
                <div className="md:col-span-4">
                    <div className="sticky top-32">
                        <h2 className="text-2xl font-display text-white mb-2">
                            {module.title}
                        </h2>
                        <div className="h-1 w-12 bg-cyan-500 mb-4" />
                        <span className="text-xs font-mono text-cyan-500/60 tracking-widest uppercase block">
                            {module.theme.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Content / Right Column */}
                <div className="md:col-span-8 space-y-8">
                    {renderContent()}
                    {renderMedia()}
                </div>
            </MotionDiv>
        </section>
    );
};
