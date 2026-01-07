import { MotionDiv } from '../../motion/MotionWrappers';

interface HighlightStatementProps {
    content: string;
    className?: string;
}

/**
 * HighlightStatement - A flexible emphasis component for key statements.
 * Previously called "The Hook", now repositioned as "The Highlight" - 
 * can be placed anywhere to emphasize important messages (not an anchor point).
 */
export const HighlightStatement = ({ content, className = '' }: HighlightStatementProps) => {

    return (
        <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`relative py-12 md:py-16 ${className}`}
        >
            {/* Decorative quote mark */}
            <div
                className="absolute top-4 left-0 text-[80px] md:text-[120px] leading-none font-display pointer-events-none select-none"
                style={{
                    color: 'rgba(0, 240, 255, 0.06)',
                }}
            >
                "
            </div>

            {/* Main statement content - centered, no title */}
            <blockquote
                className="relative z-10 max-w-4xl mx-auto text-center"
            >
                <p
                    className="text-xl md:text-2xl lg:text-3xl font-display leading-relaxed"
                    style={{
                        color: 'rgba(224, 252, 255, 0.9)',
                        textShadow: '0 0 40px rgba(0, 240, 255, 0.15)',
                    }}
                >
                    "{content}"
                </p>
            </blockquote>

            {/* Subtle ambient glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(0, 240, 255, 0.03), transparent 70%)',
                }}
            />
        </MotionDiv>
    );
};

// Keep backward compatibility
export const HighlightQuote = HighlightStatement;
