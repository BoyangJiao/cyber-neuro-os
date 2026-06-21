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
    speed?: number; // ms per character (demo/looping fallback)
    /**
     * Audio duration (ms) of the current segment. When set (live text), the reveal
     * rate is derived from the REMAINING untyped characters so the typewriter
     * spreads its backlog across the segment's audio window and stays in sync —
     * if it fell behind on a fast sentence it speeds up to catch the voice.
     */
    durationMs?: number;
    className?: string;
    onUpdate?: () => void; // fired as each character is revealed (for auto-scroll)
}

export const TypewriterTranscript = ({ text, lines = DEMO_LINES, speed = 45, durationMs, className = '', onUpdate }: Props) => {
    const [idx, setIdx] = useState(0);
    const [shown, setShown] = useState('');
    const shownRef = useRef('');
    const timer = useRef<ReturnType<typeof setInterval>>(undefined);
    const hold = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        const full = text ?? lines[idx % lines.length];
        // Streaming case: when the live text simply GROWS, resume from where we are
        // instead of re-typing the whole line (avoids per-sentence flicker).
        let i: number;
        if (text !== undefined && shownRef.current.length > 0 && full.startsWith(shownRef.current)) {
            i = shownRef.current.length;
        } else {
            i = 0;
            shownRef.current = '';
            setShown('');
        }
        // Pace against the remaining backlog so audio and text stay locked together.
        const remaining = Math.max(1, full.length - i);
        const ms = (text !== undefined && durationMs)
            ? Math.max(24, Math.min(140, durationMs / remaining))
            : speed;
        timer.current = setInterval(() => {
            i++;
            shownRef.current = full.slice(0, i);
            setShown(shownRef.current);
            onUpdate?.();
            if (i >= full.length) {
                clearInterval(timer.current);
                if (!text) hold.current = setTimeout(() => setIdx((v) => v + 1), 2400);
            }
        }, ms);
        return () => {
            clearInterval(timer.current);
            clearTimeout(hold.current);
        };
    }, [idx, text, lines, speed, durationMs]);

    return (
        <div className={`font-mono text-brand-primary ${className}`}>
            <span className="mr-1 text-brand-primary/50">{'>'}</span>
            <span className="[text-shadow:0_0_8px_var(--color-brand-primary,#22d3ee)]">{shown}</span>
            <span className="ml-0.5 inline-block w-[0.5em] animate-pulse">▍</span>
        </div>
    );
};
