import { useState, useEffect, useRef } from 'react';

interface DecodingTextProps {
    text: string;
    isStreaming?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

/**
 * DecodingText - A component that reveals text character by character.
 * Prevents flickering by initializing based on existing text and only animating additions.
 */
export const DecodingText = ({ text, isStreaming = false }: DecodingTextProps) => {
    // stableLength determines how much of the 'text' prop we have "decoded"
    // We initialize it to text.length to prevent flickering on re-mounts (stable text stays stable)
    // For a brand new string at the start of a stream, it will naturally grow from small to large.
    const [stableLength, setStableLength] = useState(text.length);
    const [scrambledChar, setScrambledChar] = useState('');
    
    const textRef = useRef(text);
    const animationFrameRef = useRef<number | null>(null);
    const lastUpdateTimeRef = useRef(0);
    const scrambleTickRef = useRef(0);

    // Sync ref and handle non-streaming state
    useEffect(() => {
        textRef.current = text;
        if (!isStreaming) {
            setStableLength(text.length);
            setScrambledChar('');
        }
    }, [text, isStreaming]);

    // Handle initial state for NEW text segments
    // If the component mounts with an empty string, it's the start of a new stream block.
    // If it mounts with content, we assume it's a re-mount and show it instantly.
    useEffect(() => {
        if (isStreaming && text.length <= 1) {
            setStableLength(0);
        }
    }, []); // Only on mount

    useEffect(() => {
        if (!isStreaming || stableLength >= text.length) {
            if (stableLength >= text.length) setScrambledChar('');
            return;
        }

        const animate = (timestamp: number) => {
            // Speed: ~20ms per character to keep up with the stream
            if (timestamp - lastUpdateTimeRef.current > 20) {
                lastUpdateTimeRef.current = timestamp;

                const target = textRef.current;
                
                if (stableLength < target.length) {
                    // Scramble the "head" character for 2 ticks before finalizing it
                    if (scrambleTickRef.current < 2) {
                        const nextChar = target[stableLength];
                        if (!nextChar || nextChar === ' ' || nextChar === '\n') {
                            setStableLength(prev => prev + 1);
                            scrambleTickRef.current = 0;
                            setScrambledChar('');
                        } else {
                            setScrambledChar(CHARS[Math.floor(Math.random() * CHARS.length)]);
                            scrambleTickRef.current += 1;
                        }
                    } else {
                        // finalize
                        setStableLength(prev => prev + 1);
                        setScrambledChar('');
                        scrambleTickRef.current = 0;
                    }
                }
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isStreaming, stableLength, text.length]);

    // Display: Stable part + Scrambled tip
    // We don't show the rest of the 'text' yet to create the "one by one" spitting effect
    const display = text.slice(0, stableLength) + scrambledChar;

    return <span>{display}</span>;
};
