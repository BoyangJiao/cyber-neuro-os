/**
 * NeuralUplinkWindow — 可拖拽/可缩放的 AI Agent 对话窗口
 * 
 * 参考 CyberDebugPanel 的拖拽/缩放交互模式。
 * 外观采用 HoloFrame + 深色毛玻璃赛博朋克风格。
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
const MIN_WIDTH = 320;
const MIN_HEIGHT = 400;
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 560;

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
    const [isCollapsed, setIsCollapsed] = useState(false);

    // ============================================================
    // Drag & Resize
    // ============================================================
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
    const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
    // Auto-scroll when new messages arrive
    // ============================================================
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, ease: 'circOut' }}
                >
                    <HoloFrame
                        variant="lines"
                        className="bg-neutral-950/95 backdrop-blur-md !p-0 overflow-hidden shadow-[0_0_30px_rgba(var(--brand-primary-rgb),0.15)]"
                        active={true}
                    >
                        {/* ======== Title Bar ======== */}
                        <div
                            onMouseDown={handleDragStart}
                            className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-brand-primary)]/20 bg-gradient-to-r from-[var(--color-brand-primary)]/5 to-neutral-950/80 cursor-grab active:cursor-grabbing select-none"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[var(--color-brand-primary)] shadow-[0_0_8px_var(--color-brand-primary)] animate-pulse" />
                                <span className="text-[10px] font-bold text-[var(--color-brand-primary)] tracking-[0.2em] uppercase">
                                    {AGENT_NAME} <span className="text-[var(--color-text-muted)] font-normal">//</span> NEURAL UPLINK
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {/* Clear history */}
                                <button
                                    onClick={clearHistory}
                                    className="w-6 h-6 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] transition-colors cursor-pointer"
                                    title="Clear history"
                                >
                                    <i className="ri-delete-bin-line text-xs" />
                                </button>
                                {/* Collapse/Expand */}
                                <button
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className="w-6 h-6 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] transition-colors cursor-pointer"
                                >
                                    <i className={`ri-${isCollapsed ? 'add' : 'subtract'}-line text-sm`} />
                                </button>
                                {/* Close */}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-6 h-6 flex items-center justify-center text-[var(--color-text-muted)] hover:text-red-400 transition-colors cursor-pointer"
                                >
                                    <i className="ri-close-line text-sm" />
                                </button>
                            </div>
                        </div>

                        {/* ======== Body (collapsible) ======== */}
                        <AnimatePresence>
                            {!isCollapsed && (
                                <MotionDiv
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: size.height - 44, opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden flex flex-col"
                                >
                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-[var(--color-brand-primary)]/20 scrollbar-track-transparent">
                                        {/* Welcome message if no history */}
                                        {messages.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                                                <div className="w-12 h-12 rounded-lg bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/30 flex items-center justify-center">
                                                    <i className="ri-robot-2-line text-xl text-[var(--color-brand-primary)]" />
                                                </div>
                                                <div className="text-center space-y-2 max-w-[280px]">
                                                    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--color-brand-primary)]">
                                                        {AGENT_NAME} // ONLINE
                                                    </p>
                                                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                                        {language === 'zh' ? WELCOME_MESSAGE.zh : WELCOME_MESSAGE.en}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Message list */}
                                        {messages.map(msg => (
                                            <AgentMessageBubble
                                                key={msg.id}
                                                role={msg.role}
                                                content={msg.content}
                                                isStreaming={msg.isStreaming}
                                                timestamp={msg.timestamp}
                                            />
                                        ))}

                                        {/* Error display */}
                                        {error && (
                                            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
                                                <i className="ri-error-warning-line" />
                                                {error}
                                            </div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <AgentInput onSend={handleSend} disabled={isStreaming} />

                                    {/* Resize Handle */}
                                    <div
                                        onMouseDown={handleResizeStart}
                                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group"
                                    >
                                        <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-[var(--color-brand-primary)]/40 group-hover:border-[var(--color-brand-primary)] transition-colors" />
                                    </div>
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </HoloFrame>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};
