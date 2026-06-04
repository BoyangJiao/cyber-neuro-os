/**
 * TypewriterTranscript — reveals the agent's spoken text char-by-char beside the
 * avatar. For now it cycles demo lines; later it's fed the live TTS/agent text
 * (pass `text` to type a single live line, or `lines` to loop placeholders).
 */
import { useEffect, useRef, useState } from 'react';

const DEMO_LINES = [
    '神经链接已建立。我是 Borvis。',
    '你可以用语音，或者打字和我对话。',
    '我在听……',
];

interface Props {
    /** Live single line — types this and stops (use for real agent output). */
    text?: string;
    /** Looping placeholder lines (demo). Ignored if `text` is set. */
    lines?: string[];
    speed?: number; // ms per character
    className?: string;
}

export const TypewriterTranscript = ({ text, lines = DEMO_LINES, speed = 45, className = '' }: Props) => {
    const [idx, setIdx] = useState(0);
    const [shown, setShown] = useState('');
    const timer = useRef<ReturnType<typeof setInterval>>(undefined);
    const hold = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        const full = text ?? lines[idx % lines.length];
        setShown('');
        let i = 0;
        timer.current = setInterval(() => {
            i++;
            setShown(full.slice(0, i));
            if (i >= full.length) {
                clearInterval(timer.current);
                if (!text) hold.current = setTimeout(() => setIdx((v) => v + 1), 2400);
            }
        }, speed);
        return () => {
            clearInterval(timer.current);
            clearTimeout(hold.current);
        };
    }, [idx, text, lines, speed]);

    return (
        <div className={`font-mono text-brand-primary ${className}`}>
            <span className="mr-1 text-brand-primary/50">{'>'}</span>
            <span className="[text-shadow:0_0_8px_var(--color-brand-primary,#22d3ee)]">{shown}</span>
            <span className="ml-0.5 inline-block w-[0.5em] animate-pulse">▍</span>
        </div>
    );
};
