import { create } from 'zustand';

// ============================================================
// Agent Message Types
// ============================================================

export interface AgentMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    isStreaming?: boolean;
}

// ============================================================
// Agent State
// ============================================================

interface AgentState {
    // Panel visibility
    isOpen: boolean;
    togglePanel: () => void;
    setOpen: (open: boolean) => void;

    // Messages
    messages: AgentMessage[];
    isStreaming: boolean;
    error: string | null;

    // Actions
    addUserMessage: (content: string) => void;
    startAssistantMessage: () => string; // returns message id
    appendToken: (id: string, token: string) => void;
    finishStreaming: (id: string) => void;
    setError: (error: string | null) => void;
    clearHistory: () => void;
}

// ============================================================
// localStorage Persistence
// ============================================================

const STORAGE_KEY = 'nexus-chat-history';

const loadMessages = (): AgentMessage[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Filter out any incomplete streaming messages from previous sessions
            return parsed.filter((m: AgentMessage) => !m.isStreaming);
        }
    } catch (e) {
        console.warn('[NEXUS] Failed to load chat history:', e);
    }
    return [];
};

const saveMessages = (messages: AgentMessage[]) => {
    try {
        // Only persist completed messages
        const completed = messages.filter(m => !m.isStreaming);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch (e) {
        console.warn('[NEXUS] Failed to save chat history:', e);
    }
};

// ============================================================
// Utility
// ============================================================

const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ============================================================
// Store
// ============================================================

export const useAgentStore = create<AgentState>((set) => ({
    // Panel
    isOpen: false,
    togglePanel: () => set(state => ({ isOpen: !state.isOpen })),
    setOpen: (open) => set({ isOpen: open }),

    // Messages (load from localStorage)
    messages: loadMessages(),
    isStreaming: false,
    error: null,

    // Add a user message
    addUserMessage: (content) => {
        const message: AgentMessage = {
            id: generateId(),
            role: 'user',
            content,
            timestamp: Date.now(),
        };
        set(state => {
            const messages = [...state.messages, message];
            saveMessages(messages);
            return { messages, error: null };
        });
    },

    // Start an assistant message (for streaming)
    startAssistantMessage: () => {
        const id = generateId();
        const message: AgentMessage = {
            id,
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
            isStreaming: true,
        };
        set(state => ({
            messages: [...state.messages, message],
            isStreaming: true,
            error: null,
        }));
        return id;
    },

    // Append a token to a streaming message
    appendToken: (id, token) => {
        set(state => ({
            messages: state.messages.map(m =>
                m.id === id ? { ...m, content: m.content + token } : m
            ),
        }));
    },

    // Finish streaming a message
    finishStreaming: (id) => {
        set(state => {
            const messages = state.messages.map(m =>
                m.id === id ? { ...m, isStreaming: false } : m
            );
            saveMessages(messages);
            return { messages, isStreaming: false };
        });
    },

    // Set error
    setError: (error) => set({ error, isStreaming: false }),

    // Clear all history
    clearHistory: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({ messages: [], error: null });
    },
}));
