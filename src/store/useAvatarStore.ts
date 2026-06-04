/**
 * useAvatarStore — the embodied agent's runtime state.
 *
 * `status` (low-frequency) drives the avatar's visual mood and is fine as React
 * state. `jaw` (per-frame, audio/envelope-driven) is kept OUT of React in a plain
 * mutable signal so the render loop can read/write it 60×/s without re-rendering.
 */
import { create } from 'zustand';

export type AgentStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

/** Facial emotion the avatar wears. Derived from the reply's content (heuristic
 *  now; an LLM-judged signal can set this later — same field). */
export type Emotion = 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'curious';

/** Per-frame signals read in useFrame (never trigger React):
 *  jaw = Borvis's mouth-open while speaking; mic = user's input loudness while listening. */
export const avatarSignal = { jaw: 0, mic: 0 };

interface AvatarState {
    status: AgentStatus;
    emotion: Emotion;
    transcript: string;       // the line currently being spoken (for the typewriter)
    setStatus: (s: AgentStatus) => void;
    setEmotion: (e: Emotion) => void;
    setTranscript: (t: string) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
    status: 'idle',
    emotion: 'neutral',
    transcript: '',
    setStatus: (status) => set({ status }),
    setEmotion: (emotion) => set({ emotion }),
    setTranscript: (transcript) => set({ transcript }),
}));
