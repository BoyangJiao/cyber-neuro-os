/**
 * AgentMessage — 单条对话消息气泡
 * 
 * v2 — 全面重构:
 * - 重新设计的视觉层次和排版
 * - 旧消息折叠/展开 (基于 LukeW: "Usable Chat Interfaces")
 * - 优化的流式/思考状态动画
 * - AI 消息使用全宽布局以增强可读性
 */
import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MotionDiv } from '../motion/MotionWrappers';
import { AGENT_NAME } from '../../data/agentSystemPrompt';

interface AgentMessageProps {
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
    timestamp: number;
    /** Whether this message is part of the latest exchange (last 2 msgs) */
    isLatestExchange?: boolean;
}

export const AgentMessageBubble = ({ role, content, isStreaming, timestamp, isLatestExchange = true }: AgentMessageProps) => {
    const isUser = role === 'user';
    const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Collapse old messages (not in the latest exchange)
    const [isCollapsed, setIsCollapsed] = useState(!isLatestExchange);

    const toggleCollapse = useCallback(() => {
        if (!isLatestExchange) {
            setIsCollapsed(prev => !prev);
        }
    }, [isLatestExchange]);

    // Truncate content for collapsed preview
    const collapsedPreview = content.length > 60 ? content.slice(0, 60) + '...' : content;

    if (isUser) {
        // ============================================================
        // User Message — Right-aligned, brand-colored
        // ============================================================
        return (
            <div className="flex flex-col items-end gap-1">
                {/* Timestamp */}
                <span className="text-[8px] font-mono text-[var(--color-text-muted)]/40 px-1">
                    {time}
                </span>
                {/* Bubble */}
                <div className="max-w-[85%] px-3.5 py-2.5 rounded-lg rounded-br-sm text-[13px] leading-relaxed font-sans
                    bg-[var(--color-brand-primary)]/[0.08] border border-[var(--color-brand-primary)]/20
                    text-[var(--color-text-primary)]">
                    {content}
                </div>
            </div>
        );
    }

    // ============================================================
    // Assistant Message — Left-aligned with NEXUS indicator
    // ============================================================
    return (
        <div className="flex flex-col items-start gap-1">
            {/* Header: Avatar + Name + Timestamp */}
            <div className="flex items-center gap-2 px-0.5">
                {/* NEXUS mini avatar */}
                <div className="w-[18px] h-[18px] rounded-sm bg-gradient-to-br from-[var(--color-brand-primary)]/20 to-[var(--color-brand-primary)]/5 border border-[var(--color-brand-primary)]/30 flex items-center justify-center shrink-0">
                    <i className="ri-brain-line text-[9px] text-[var(--color-brand-primary)]" />
                </div>
                <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-[var(--color-brand-primary)]/70 font-medium">
                    {AGENT_NAME}
                </span>
                <span className="text-[8px] font-mono text-[var(--color-text-muted)]/40">
                    {time}
                </span>
                {/* Collapse indicator for old messages */}
                {!isLatestExchange && (
                    <button
                        onClick={toggleCollapse}
                        className="ml-auto text-[8px] font-mono text-[var(--color-text-muted)]/40 hover:text-[var(--color-brand-primary)] transition-colors cursor-pointer flex items-center gap-0.5"
                    >
                        <i className={`ri-${isCollapsed ? 'expand-up-down' : 'collapse-vertical'}-line text-[10px]`} />
                    </button>
                )}
            </div>

            {/* Message Content */}
            <AnimatePresence mode="wait">
                {isCollapsed ? (
                    // Collapsed preview
                    <MotionDiv
                        key="collapsed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button
                            onClick={toggleCollapse}
                            className="w-full text-left px-3 py-1.5 rounded-md
                                bg-white/[0.015] border border-white/[0.04]
                                text-[12px] text-[var(--color-text-muted)]/60 font-sans leading-relaxed
                                hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-200 cursor-pointer"
                        >
                            {collapsedPreview}
                        </button>
                    </MotionDiv>
                ) : (
                    // Full message
                    <MotionDiv
                        key="expanded"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        <div className="w-full px-3.5 py-2.5 rounded-lg rounded-tl-sm text-[13px] leading-[1.7] font-sans
                            bg-white/[0.025] border border-white/[0.06]
                            text-[var(--color-text-secondary)]">
                            {/* Thinking state — before first token arrives */}
                            {isStreaming && !content && (
                                <ThinkingIndicator />
                            )}
                            {/* Content */}
                            {content}
                            {/* Streaming cursor */}
                            {isStreaming && content && (
                                <span className="inline-block w-[2px] h-[15px] bg-[var(--color-brand-primary)] ml-1 align-middle rounded-full shadow-[0_0_6px_var(--color-brand-primary)]"
                                    style={{ animation: 'pulse 1s ease-in-out infinite' }} />
                            )}
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================================
// ThinkingIndicator — Animated "AI is processing" visualization
// ============================================================
const ThinkingIndicator = () => (
    <div className="flex items-center gap-2 py-0.5">
        <div className="flex items-center gap-[3px]">
            {[0, 1, 2, 3].map(i => (
                <div
                    key={i}
                    className="w-[3px] rounded-full bg-[var(--color-brand-primary)]/60"
                    style={{
                        height: '8px',
                        animation: `thinkingWave 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }}
                />
            ))}
        </div>
        <span className="text-[10px] font-mono tracking-wider text-[var(--color-text-muted)]/50 uppercase">
            Analyzing...
        </span>
        <style>{`
            @keyframes thinkingWave {
                0%, 100% { height: 4px; opacity: 0.4; }
                50% { height: 14px; opacity: 1; }
            }
        `}</style>
    </div>
);
