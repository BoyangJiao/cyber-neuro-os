/**
 * AgentInput — 对话输入栏
 *
 * Enter 发送、Shift+Enter 换行、流式回复时禁用
 */
import { useState, useRef, useEffect } from 'react';

interface AgentInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
}

export const AgentInput = ({ onSend, disabled = false }: AgentInputProps) => {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
        }
    }, [value]);

    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue('');
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-end gap-2 p-3 border-t border-[var(--color-border-subtle)] bg-black/40">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder={disabled ? 'NEXUS is thinking...' : 'Type a message...'}
                rows={1}
                className="
                    flex-1 resize-none bg-white/5 border border-white/10 rounded-md px-3 py-2
                    text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/50
                    font-sans leading-relaxed
                    focus:outline-none focus:border-[var(--color-brand-primary)]/50 focus:ring-1 focus:ring-[var(--color-brand-primary)]/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-150
                "
            />
            <button
                onClick={handleSend}
                disabled={disabled || !value.trim()}
                className="
                    shrink-0 w-9 h-9 rounded-md
                    flex items-center justify-center
                    bg-[var(--color-brand-primary)]/20 border border-[var(--color-brand-primary)]/40
                    text-[var(--color-brand-primary)]
                    hover:bg-[var(--color-brand-primary)]/30 hover:shadow-[0_0_8px_var(--color-brand-primary)]
                    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-brand-primary)]/20 disabled:hover:shadow-none
                    transition-all duration-150 cursor-pointer
                "
            >
                <i className="ri-send-plane-2-fill text-sm" />
            </button>
        </div>
    );
};
