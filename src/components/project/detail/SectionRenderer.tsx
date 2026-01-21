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
    const viewportConfig = { once: true, margin: "-10% 0px -10% 0px" };

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
            normal: ({ children }: any) => <p className="text-lg 2xl:text-xl text-text-primary leading-relaxed 2xl:leading-loose max-w-2xl 2xl:max-w-3xl">{children}</p>,
            h4: ({ children }: any) => <h4 className="text-xl 2xl:text-2xl font-display text-brand-primary mb-4 2xl:mb-5">{children}</h4>,
        },
        list: {
            bullet: ({ children }: any) => <ul className="list-disc pl-5 mb-4 2xl:mb-5 text-text-primary space-y-2 2xl:space-y-3 text-base 2xl:text-lg">{children}</ul>,
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
            <div className="relative rounded-lg overflow-hidden border border-brand-primary/20 bg-black/40">
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
                className="py-20 2xl:py-28 border-b border-border-subtle min-h-[60vh] flex flex-col justify-center"
            >
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    onViewportEnter={handleViewportEnter}
                    className="w-full"
                >
                    <div className="mb-8 2xl:mb-10">
                        <span className="text-xs 2xl:text-sm font-mono text-brand-primary tracking-widest uppercase mb-2 block">
                            {module.theme.toUpperCase()}
                        </span>
                        <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-display text-white mb-6 2xl:mb-8">
                            {module.title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-10 2xl:gap-14">
                        {renderMedia()}
                        <div className="max-w-4xl 2xl:max-w-5xl mx-auto w-full">
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
                className="py-20 2xl:py-28 border-b border-border-subtle"
            >
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    onViewportEnter={handleViewportEnter}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 2xl:gap-16 items-center"
                >
                    <div>
                        <span className="text-xs 2xl:text-sm font-mono text-brand-primary tracking-widest uppercase mb-2 block">
                            {module.theme.toUpperCase()}
                        </span>
                        <h2 className="text-3xl 2xl:text-4xl font-display text-white mb-6 2xl:mb-8">
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
            className="py-20 2xl:py-28 border-b border-border-subtle"
        >
            <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportConfig}
                onViewportEnter={handleViewportEnter}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 2xl:gap-12"
            >
                {/* Section Header / Left Column */}
                <div className="md:col-span-4">
                    <div className="sticky top-6">
                        <h2 className="text-2xl 2xl:text-3xl font-display text-white mb-2 2xl:mb-3">
                            {module.title}
                        </h2>
                        <div className="h-1 w-12 2xl:w-16 bg-brand-primary mb-4 2xl:mb-5" />
                        <span className="text-xs 2xl:text-sm font-mono text-brand-secondary tracking-widest uppercase block">
                            {module.theme.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Content / Right Column */}
                <div className="md:col-span-8 space-y-8 2xl:space-y-10">
                    {renderContent()}
                    {renderMedia()}
                </div>
            </MotionDiv>
        </section>
    );
};
