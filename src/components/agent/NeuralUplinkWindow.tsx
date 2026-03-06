/**
 * NeuralUplinkWindow — 可拖拽/可缩放的 AI Agent 对话窗口
 * 
 * v2 — 内部交互全面重构:
 * - 沉浸式欢迎界面 + 快捷提问标签
 * - 重新设计的标题栏 (含连接状态)
 * - 优化的滚动管理
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HoloFrame } from '../ui/HoloFrame';
import { MotionDiv } from '../motion/MotionWrappers';
import { useAgentStore } from '../../store/useAgentStore';
import { streamChat } from '../../services/agentService';
import { AGENT_NAME, WELCOME_MESSAGE } from '../../data/agentSystemPrompt';
import { AgentMessageBubble } from './AgentMessage';
import { AgentInput } from './AgentInput';
import { useLanguage } from '../../i18n';

// ============================================================
// Dimension Constants
// ============================================================
const MIN_WIDTH = 340;
const MIN_HEIGHT = 420;
const DEFAULT_WIDTH = 420;
const DEFAULT_HEIGHT = 580;

// ============================================================
// Quick-Start Prompts — 解决空白页焦虑
// ============================================================
const QUICK_PROMPTS = {
    en: [
        { icon: 'ri-user-smile-line', text: 'Tell me about yourself' },
        { icon: 'ri-folder-6-line', text: 'Show me your best project' },
        { icon: 'ri-lightbulb-line', text: "What's your design philosophy?" },
        { icon: 'ri-code-s-slash-line', text: 'How do you bridge design & code?' },
    ],
    zh: [
        { icon: 'ri-user-smile-line', text: '介绍一下你自己' },
        { icon: 'ri-folder-6-line', text: '展示你最好的项目' },
        { icon: 'ri-lightbulb-line', text: '你的设计理念是什么？' },
        { icon: 'ri-code-s-slash-line', text: '你如何连接设计与代码？' },
    ],
};

export const NeuralUplinkWindow = () => {
    const { language } = useLanguage();
    const {
        isOpen,
        setOpen,
        messages,
        isStreaming,
        error,
        addUserMessage,
        startAssistantMessage,
        appendToken,
        finishStreaming,
        setError,
        clearHistory,
    } = useAgentStore();

    // ============================================================
    // Position / Size State
    // ============================================================
    const [position, setPosition] = useState({
        x: typeof window !== 'undefined' ? window.innerWidth - DEFAULT_WIDTH - 24 : 100,
        y: typeof window !== 'undefined' ? window.innerHeight - DEFAULT_HEIGHT - 80 : 100,
    });
    const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });

    // ============================================================
    // Drag & Resize
    // ============================================================
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
    const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const handleDragStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
    }, [position]);

    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        resizeStartRef.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height };
    }, [size]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const dx = e.clientX - dragStartRef.current.x;
                const dy = e.clientY - dragStartRef.current.y;
                setPosition({
                    x: Math.max(0, Math.min(window.innerWidth - size.width, dragStartRef.current.posX + dx)),
                    y: Math.max(0, Math.min(window.innerHeight - 50, dragStartRef.current.posY + dy)),
                });
            }
            if (isResizing) {
                const dx = e.clientX - resizeStartRef.current.x;
                const dy = e.clientY - resizeStartRef.current.y;
                setSize({
                    width: Math.max(MIN_WIDTH, resizeStartRef.current.width + dx),
                    height: Math.max(MIN_HEIGHT, resizeStartRef.current.height + dy),
                });
            }
        };
        const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, size.width]);

    // ============================================================
    // Smart auto-scroll: only scroll if user is near bottom
    // ============================================================
    const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        const handleScroll = () => {
            const threshold = 80;
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
            setIsUserScrolledUp(!isNearBottom);
        };
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isUserScrolledUp) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isUserScrolledUp]);

    // ============================================================
    // Send Message Handler
    // ============================================================
    const handleSend = useCallback(async (content: string) => {
        addUserMessage(content);
        const msgId = startAssistantMessage();

        try {
            const allMessages = [...useAgentStore.getState().messages];
            await streamChat({
                messages: allMessages,
                onToken: (token) => appendToken(msgId, token),
                onDone: () => finishStreaming(msgId),
                onError: (err) => {
                    setError(err);
                    finishStreaming(msgId);
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            finishStreaming(msgId);
        }
    }, [addUserMessage, startAssistantMessage, appendToken, finishStreaming, setError]);

    const handleQuickPrompt = useCallback((text: string) => {
        handleSend(text);
    }, [handleSend]);

    const prompts = language === 'zh' ? QUICK_PROMPTS.zh : QUICK_PROMPTS.en;

    // ============================================================
    // Render
    // ============================================================
    return (
        <AnimatePresence>
            {isOpen && (
                <MotionDiv
                    className="fixed z-[200]"
                    style={{
                        left: position.x,
                        top: position.y,
                        width: size.width,
                        cursor: isDragging ? 'grabbing' : 'default',
                    }}
                    initial={{ opacity: 0, scale: 0.92, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 30 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                    <HoloFrame
                        variant="lines"
                        className="bg-neutral-950/95 backdrop-blur-xl !p-0 overflow-hidden shadow-[0_0_40px_rgba(var(--brand-primary-rgb),0.12),0_8px_32px_rgba(0,0,0,0.6)]"
                        active={true}
                    >
                        {/* ======== Title Bar ======== */}
                        <div
                            onMouseDown={handleDragStart}
                            className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-brand-primary)]/15 bg-gradient-to-r from-[var(--color-brand-primary)]/[0.04] via-transparent to-transparent cursor-grab active:cursor-grabbing select-none"
                        >
                            <div className="flex items-center gap-2.5">
                                {/* Neural pulse status dot */}
                                <div className="relative w-2 h-2">
                                    <div className="absolute inset-0 bg-[var(--color-brand-primary)] rounded-full" />
                                    <div className="absolute inset-0 bg-[var(--color-brand-primary)] rounded-full animate-ping opacity-40" />
                                </div>
                                <span className="text-[10px] font-bold text-[var(--color-brand-primary)] tracking-[0.2em] uppercase font-display">
                                    {AGENT_NAME}
                                </span>
                                <span className="text-[9px] font-mono text-[var(--color-text-muted)]/60 tracking-wider">
                                    // NEURAL UPLINK
                                </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                {/* Clear history */}
                                <button
                                    onClick={clearHistory}
                                    className="w-7 h-7 flex items-center justify-center text-[var(--color-text-muted)]/60 hover:text-[var(--color-brand-primary)] transition-colors duration-200 cursor-pointer rounded-sm hover:bg-[var(--color-brand-primary)]/[0.06]"
                                    title="Clear history"
                                >
                                    <i className="ri-delete-bin-line text-xs" />
                                </button>
                                {/* Close */}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-7 h-7 flex items-center justify-center text-[var(--color-text-muted)]/60 hover:text-red-400 transition-colors duration-200 cursor-pointer rounded-sm hover:bg-red-500/[0.06]"
                                >
                                    <i className="ri-close-line text-sm" />
                                </button>
                            </div>
                        </div>

                        {/* ======== Body ======== */}
                        <MotionDiv
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: size.height - 48, opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden flex flex-col"
                        >
                            {/* Messages Area */}
                            <div
                                ref={messagesContainerRef}
                                className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-[var(--color-brand-primary)]/15 scrollbar-track-transparent"
                            >
                                {/* ======== Welcome / Empty State ======== */}
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full gap-5 py-6">
                                        {/* NEXUS Identity Block */}
                                        <div className="flex flex-col items-center gap-3">
                                            {/* Animated neural icon */}
                                            <div className="relative w-14 h-14 flex items-center justify-center">
                                                {/* Outer ring pulse */}
                                                <div className="absolute inset-0 rounded-lg border border-[var(--color-brand-primary)]/20 animate-pulse" />
                                                <div className="absolute inset-[-4px] rounded-xl border border-[var(--color-brand-primary)]/[0.08]" />
                                                {/* Core icon */}
                                                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[var(--color-brand-primary)]/15 to-[var(--color-brand-primary)]/5 border border-[var(--color-brand-primary)]/25 flex items-center justify-center">
                                                    <i className="ri-brain-line text-xl text-[var(--color-brand-primary)]" />
                                                </div>
                                            </div>

                                            {/* Status label */}
                                            <div className="flex flex-col items-center gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-400/90">
                                                        ONLINE
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed text-center max-w-[300px]">
                                                    {language === 'zh' ? WELCOME_MESSAGE.zh : WELCOME_MESSAGE.en}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="w-full flex items-center gap-3 px-2">
                                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-primary)]/15 to-transparent" />
                                            <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-[var(--color-text-muted)]/40">
                                                {language === 'zh' ? '快速提问' : 'QUICK START'}
                                            </span>
                                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-primary)]/15 to-transparent" />
                                        </div>

                                        {/* Quick-Start Prompt Chips */}
                                        <div className="w-full flex flex-col gap-2 px-1">
                                            {prompts.map((prompt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleQuickPrompt(prompt.text)}
                                                    className="group/chip flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md
                                                        bg-white/[0.02] border border-white/[0.06]
                                                        hover:bg-[var(--color-brand-primary)]/[0.06] hover:border-[var(--color-brand-primary)]/20
                                                        transition-all duration-250 cursor-pointer text-left"
                                                >
                                                    <i className={`${prompt.icon} text-sm text-[var(--color-text-muted)]/50 group-hover/chip:text-[var(--color-brand-primary)] transition-colors duration-250`} />
                                                    <span className="text-xs text-[var(--color-text-secondary)] group-hover/chip:text-[var(--color-text-primary)] transition-colors duration-250 leading-snug">
                                                        {prompt.text}
                                                    </span>
                                                    <i className="ri-arrow-right-s-line text-xs text-transparent group-hover/chip:text-[var(--color-brand-primary)]/60 transition-all duration-250 ml-auto" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Message list */}
                                {messages.map((msg, idx) => (
                                    <AgentMessageBubble
                                        key={msg.id}
                                        role={msg.role}
                                        content={msg.content}
                                        isStreaming={msg.isStreaming}
                                        timestamp={msg.timestamp}
                                        isLatestExchange={idx >= messages.length - 2}
                                    />
                                ))}

                                {/* Error display */}
                                {error && (
                                    <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-md bg-red-500/[0.06] border border-red-500/20 text-xs text-red-400/90 font-mono">
                                        <i className="ri-error-warning-line text-sm shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <span className="block text-[10px] tracking-wider uppercase text-red-400/60 mb-0.5">UPLINK ERROR</span>
                                            {error}
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Scroll-to-bottom indicator */}
                            <AnimatePresence>
                                {isUserScrolledUp && messages.length > 0 && (
                                    <MotionDiv
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        className="flex justify-center py-1 border-t border-white/[0.04]"
                                    >
                                        <button
                                            onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                            className="text-[9px] font-mono text-[var(--color-text-muted)]/50 hover:text-[var(--color-brand-primary)] transition-colors cursor-pointer flex items-center gap-1"
                                        >
                                            <i className="ri-arrow-down-s-line text-xs" />
                                            {language === 'zh' ? '滚动到底部' : 'Scroll to bottom'}
                                        </button>
                                    </MotionDiv>
                                )}
                            </AnimatePresence>

                            {/* Input Area */}
                            <AgentInput onSend={handleSend} disabled={isStreaming} />

                            {/* Resize Handle */}
                            <div
                                onMouseDown={handleResizeStart}
                                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group/resize"
                            >
                                <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-[var(--color-brand-primary)]/30 group-hover/resize:border-[var(--color-brand-primary)]/70 transition-colors" />
                            </div>
                        </MotionDiv>
                    </HoloFrame>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};
