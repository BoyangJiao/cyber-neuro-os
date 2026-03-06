/**
 * AgentInput — 对话输入栏
 *
 * v2 — 增强版:
 * - 赛博朋克风格输入框 + 品牌光晕聚焦
 * - 增强的发送按钮动画状态
 * - 流式/禁用状态可视化优化
 * - Enter 发送、Shift+Enter 换行
 */
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n';

interface AgentInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
}

export const AgentInput = ({ onSend, disabled = false }: AgentInputProps) => {
    const { language } = useLanguage();
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
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

    const canSend = value.trim().length > 0 && !disabled;

    const placeholder = disabled
        ? (language === 'zh' ? 'NEXUS 正在思考...' : 'NEXUS is thinking...')
        : (language === 'zh' ? '输入消息...' : 'Type a message...');

    return (
        <div className={`
            relative flex items-end gap-2 px-3 py-3
            border-t transition-colors duration-300
            ${isFocused
                ? 'border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/[0.02]'
                : 'border-white/[0.06] bg-black/30'
            }
        `}>
            {/* Focus glow accent line */}
            <div className={`
                absolute top-0 left-0 right-0 h-[1px] 
                bg-gradient-to-r from-transparent via-[var(--color-brand-primary)] to-transparent
                transition-opacity duration-300
                ${isFocused ? 'opacity-30' : 'opacity-0'}
            `} />

            {/* Textarea */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                placeholder={placeholder}
                rows={1}
                className={`
                    flex-1 resize-none rounded-lg px-3.5 py-2.5
                    text-[13px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]/40
                    font-sans leading-relaxed
                    transition-all duration-250
                    focus:outline-none
                    disabled:opacity-40 disabled:cursor-not-allowed
                    ${isFocused
                        ? 'bg-white/[0.04] border border-[var(--color-brand-primary)]/25 shadow-[0_0_12px_rgba(var(--brand-primary-rgb),0.06)_inset]'
                        : 'bg-white/[0.025] border border-white/[0.06]'
                    }
                `}
            />

            {/* Send Button */}
            <button
                onClick={handleSend}
                disabled={!canSend}
                className={`
                    shrink-0 w-9 h-9 rounded-lg
                    flex items-center justify-center
                    transition-all duration-250 cursor-pointer
                    ${canSend
                        ? 'bg-[var(--color-brand-primary)]/15 border border-[var(--color-brand-primary)]/30 text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/25 hover:shadow-[0_0_12px_rgba(var(--brand-primary-rgb),0.2)] hover:scale-105 active:scale-95'
                        : 'bg-white/[0.02] border border-white/[0.06] text-[var(--color-text-muted)]/25 cursor-not-allowed'
                    }
                `}
            >
                {disabled ? (
                    // Streaming state indicator
                    <div className="w-3 h-3 border-2 border-[var(--color-brand-primary)]/40 border-t-[var(--color-brand-primary)] rounded-full animate-spin" />
                ) : (
                    <i className={`ri-send-plane-2-fill text-sm transition-transform duration-200 ${canSend ? '-rotate-12' : ''}`} />
                )}
            </button>

            {/* Streaming progress bar */}
            {disabled && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-transparent via-[var(--color-brand-primary)]/50 to-transparent w-1/3 animate-[shimmer_1.5s_ease-in-out_infinite]" />
                    <style>{`
                        @keyframes shimmer {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(400%); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};
