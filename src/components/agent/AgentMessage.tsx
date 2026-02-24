/**
 * AgentMessage — 单条对话消息气泡
 * 
 * - 用户消息：右对齐，品牌色边框
 * - AI 消息：左对齐，带 NEXUS 标识 + 流式光标
 */
import { AGENT_NAME } from '../../data/agentSystemPrompt';

interface AgentMessageProps {
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
    timestamp: number;
}

export const AgentMessageBubble = ({ role, content, isStreaming, timestamp }: AgentMessageProps) => {
    const isUser = role === 'user';
    const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
            {/* Sender label */}
            <div className={`flex items-center gap-1.5 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                {!isUser && (
                    <div className="w-4 h-4 rounded-sm bg-[var(--color-brand-primary)]/20 border border-[var(--color-brand-primary)]/40 flex items-center justify-center">
                        <i className="ri-robot-2-line text-[8px] text-[var(--color-brand-primary)]" />
                    </div>
                )}
                <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
                    {isUser ? 'YOU' : AGENT_NAME}
                </span>
                <span className="text-[8px] font-mono text-[var(--color-text-muted)]/50">
                    {time}
                </span>
            </div>

            {/* Message bubble */}
            <div
                className={`
                    max-w-[85%] px-3 py-2 rounded-md text-sm leading-relaxed font-sans
                    ${isUser
                        ? 'bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/30 text-[var(--color-text-primary)]'
                        : 'bg-white/5 border border-white/10 text-[var(--color-text-secondary)]'
                    }
                `}
            >
                {content}
                {/* Streaming cursor */}
                {isStreaming && (
                    <span className="inline-block w-[2px] h-[14px] bg-[var(--color-brand-primary)] ml-0.5 align-middle animate-pulse" />
                )}
                {/* Empty state while waiting for first token */}
                {isStreaming && !content && (
                    <span className="flex items-center gap-1 text-[var(--color-text-muted)] text-xs">
                        <span className="inline-block w-1 h-1 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
                        <span className="inline-block w-1 h-1 rounded-full bg-[var(--color-brand-primary)] animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="inline-block w-1 h-1 rounded-full bg-[var(--color-brand-primary)] animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </span>
                )}
            </div>
        </div>
    );
};
