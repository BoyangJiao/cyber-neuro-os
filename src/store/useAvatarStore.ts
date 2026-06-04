/**
 * useAvatarStore — the embodied agent's runtime state.
 *
 * `status` (low-frequency) drives the avatar's visual mood and is fine as React
 * state. `jaw` (per-frame, audio/envelope-driven) is kept OUT of React in a plain
 * mutable signal so the render loop can read/write it 60×/s without re-rendering.
 */
import { create } from 'zustand';

export type AgentStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

/** Per-frame mouth-open signal (0..1). Read in useFrame; never triggers React. */
export const avatarSignal = { jaw: 0 };

interface AvatarState {
    status: AgentStatus;
    transcript: string;       // the line currently being spoken (for the typewriter)
    setStatus: (s: AgentStatus) => void;
    setTranscript: (t: string) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
    status: 'idle',
    transcript: '',
    setStatus: (status) => set({ status }),
    setTranscript: (transcript) => set({ transcript }),
}));
