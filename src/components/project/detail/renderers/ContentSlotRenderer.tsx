/**
 * ContentSlotRenderer
 * 
 * 渲染单个内容块（插槽内容）
 * Renders individual content blocks (slot content)
 */
import { PortableText } from '@portabletext/react';
import { urlFor } from '../../../../sanity/client';
import type { ContentBlock, RichTextBlock, MediaBlock, StatsBlock } from '../../../../data/projectDetails';

// Portable Text customization
// Rich Text Block Renderer
const RichTextRenderer = ({ block, layout = 'constrained' }: { block: RichTextBlock; layout?: 'constrained' | 'full' }) => {
    const components = {
        block: {
            normal: ({ children }: any) => (
                <p className={`text-lg 2xl:text-xl text-text-primary leading-relaxed 2xl:leading-loose ${layout === 'full' ? 'max-w-none w-full' : 'max-w-2xl 2xl:max-w-3xl'}`}>
                    {children}
                </p>
            ),
            h1: ({ children }: any) => (
                <h1 className="text-4xl 2xl:text-5xl font-display font-bold text-text-accent mb-6 2xl:mb-8">{children}</h1>
            ),
            h2: ({ children }: any) => (
                <h2 className="text-3xl 2xl:text-4xl font-display font-bold text-text-accent mb-5 2xl:mb-6">{children}</h2>
            ),
            h3: ({ children }: any) => (
                <h3 className="text-2xl 2xl:text-3xl font-display text-text-accent mb-4 2xl:mb-5">{children}</h3>
            ),
            h4: ({ children }: any) => (
                <h4 className="text-xl 2xl:text-2xl font-sans text-text-accent mb-4 2xl:mb-5">{children}</h4>
            ),
            blockquote: ({ children }: any) => (
                <blockquote className="border-l-4 border-brand-primary pl-4 italic text-text-secondary">
                    {children}
                </blockquote>
            ),
        },
        list: {
            bullet: ({ children }: any) => (
                <ul className="list-disc pl-5 mb-4 2xl:mb-5 text-text-primary space-y-2 2xl:space-y-3 text-base 2xl:text-lg">
                    {children}
                </ul>
            ),
        },
    };

    return (
        <div className="prose prose-invert max-w-none">
            <PortableText value={block.content} components={components} />
        </div>
    );
};

// ... (MediaRenderer and StatsRenderer omitted as they don't change, but ensuring we keep them) ...
// Actually, I need to make sure I don't delete them. Since I'm using replace_file_content with a range, I need to be careful.
// I will just replace the top part and the ContentSlotRenderer export.

// Re-defining MediaRenderer and StatsRenderer to ensure they are available since I am replacing the block that likely contained ptComponents
const MediaRenderer = ({ block }: { block: MediaBlock }) => {
    const objectFit = block.layout === 'cover' ? 'object-cover' : block.layout === 'contain' ? 'object-contain' : 'object-scale-down';

    // Get video URL from either videoFile (local upload) or video (external URL)
    const videoUrl = block.videoFile?.asset?.url || block.video;

    if (videoUrl) {
        return (
            <div className="relative rounded-lg overflow-hidden">
                <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-auto"
                    style={{ objectFit: 'cover' }}
                    aria-label={block.alt || 'Video content'}
                />
                {block.caption && (
                    <p className="text-sm text-text-secondary mt-2 italic">{block.caption}</p>
                )}
            </div>
        );
    }

    if (block.image) {
        // Check if image is a GIF by looking at the original filename or mimeType
        // Sanity stores the original filename in asset._ref or asset.originalFilename
        const assetRef = block.image?.asset?._ref || '';
        const isGif = assetRef.toLowerCase().includes('-gif') ||
            block.image?.asset?.mimeType?.includes('gif') ||
            block.image?.asset?.extension === 'gif';

        // For GIFs, skip width transform to preserve animation
        // For other images, apply width transform for performance
        let imageUrl: string;
        if (isGif) {
            // Use auto format but without width constraint to preserve GIF
            imageUrl = urlFor(block.image).url();
        } else {
            imageUrl = urlFor(block.image).width(1200).auto('format').url();
        }

        return (
            <div className="relative rounded-lg overflow-hidden">
                <img
                    src={imageUrl}
                    alt={block.alt || 'Media content'}
                    className={`w-full h-auto ${objectFit}`}
                />
                {block.caption && (
                    <p className="text-sm text-text-secondary mt-2 italic">{block.caption}</p>
                )}
            </div>
        );
    }

    return null;
};

const StatsRenderer = ({ block }: { block: StatsBlock }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {block.items?.map((item, index) => (
            <div key={index} className="border border-brand-primary/30 rounded-lg p-4 bg-black/30 backdrop-blur-sm">
                <div className="text-3xl 2xl:text-4xl font-display text-brand-primary mb-1">
                    {item.value}
                </div>
                <div className="text-sm text-text-secondary uppercase tracking-wider">
                    {item.label}
                </div>
                {item.description && (
                    <div className="text-xs text-text-muted mt-2">{item.description}</div>
                )}
            </div>
        ))}
    </div>
);

// Main ContentSlotRenderer - dispatches to appropriate renderer
export const ContentSlotRenderer = ({ blocks, layout = 'constrained' }: { blocks: ContentBlock[]; layout?: 'constrained' | 'full' }) => {
    if (!blocks || blocks.length === 0) return null;

    return (
        <div className="space-y-4">
            {blocks.map((block) => {
                switch (block._type) {
                    case 'richTextBlock':
                        return <RichTextRenderer key={block._key} block={block} layout={layout} />;
                    case 'mediaBlock':
                        return <MediaRenderer key={block._key} block={block} />;
                    case 'statsBlock':
                        return <StatsRenderer key={block._key} block={block} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};
