import { create } from 'zustand';
import { useMusicStore } from './useMusicStore';
import { useAvatarStore } from './useAvatarStore';
import { cancelSpeech, unlockAudio } from '../services/speechService';

// ============================================================
// Agent Message Type (used by the streaming service)
// ============================================================

export interface AgentMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    isStreaming?: boolean;
}

// ============================================================
// Agent State — Borvis immersive session
// ============================================================

type TransitionDir = 'enter' | 'exit';

interface AgentState {
    isBorvisMode: boolean;
    isBorvisTransitioning: boolean;
    borvisTransitionDir: TransitionDir;
    enterBorvis: () => void;
    exitBorvis: () => void;
}

// ============================================================
// Music fade helpers (module-level — single Borvis session at a time)
// ============================================================

let _savedMusicVol = 15;
let _musicFadeTimer: ReturnType<typeof setInterval> | null = null;

function startMusicFade(targetVol: number, durationMs: number) {
    if (_musicFadeTimer !== null) { clearInterval(_musicFadeTimer); _musicFadeTimer = null; }
    const startVol = useMusicStore.getState().volume;
    const steps = Math.ceil(durationMs / 16);
    const delta = (targetVol - startVol) / steps;
    let step = 0;
    _musicFadeTimer = setInterval(() => {
        step++;
        const v = Math.max(0, Math.min(100, Math.round(startVol + delta * step)));
        useMusicStore.getState().setVolume(v);
        if (step >= steps) { clearInterval(_musicFadeTimer!); _musicFadeTimer = null; }
    }, 16);
}

// Transition timing (ms). enter/exit are mirror images; keep the two phases here
// (the SignalHijack overlay's internal phases are tuned to fit within these).
const ENTER_MOUNT_AT = 700;
const ENTER_DONE_AT = 1100;
const EXIT_UNMOUNT_AT = 450;
const EXIT_DONE_AT = 950;

// Pending enter/exit setTimeouts. Tracked so an opposite transition can cancel
// them — otherwise a stale enter timer could fire after exit and re-mount the
// overlay onto the home page (or restore the wrong music volume).
let _transitionTimers: ReturnType<typeof setTimeout>[] = [];
function clearTransitionTimers() {
    for (const t of _transitionTimers) clearTimeout(t);
    _transitionTimers = [];
}
function scheduleTransition(fn: () => void, ms: number) {
    _transitionTimers.push(setTimeout(fn, ms));
}

// ============================================================
// Store
// ============================================================

export const useAgentStore = create<AgentState>((set, get) => ({
    isBorvisMode: false,
    isBorvisTransitioning: false,
    borvisTransitionDir: 'enter',

    enterBorvis: () => {
        // Ignore repeat triggers while already inside or mid-enter, so we never
        // re-capture the music baseline mid-fade or stack duplicate mount timers.
        if (get().isBorvisMode || (get().isBorvisTransitioning && get().borvisTransitionDir === 'enter')) return;
        clearTransitionTimers();

        // Called from a tap/click handler — the one reliable place to unlock
        // mobile audio so the greeting (fired later, outside any gesture) plays.
        unlockAudio();

        // Clear any stale session state so we don't flash the last reply.
        const av = useAvatarStore.getState();
        av.setTranscript('');
        av.setStatus('idle');
        av.setEmotion('neutral');

        _savedMusicVol = useMusicStore.getState().volume;
        startMusicFade(0, 600);

        set({ borvisTransitionDir: 'enter', isBorvisTransitioning: true });
        scheduleTransition(() => set({ isBorvisMode: true }), ENTER_MOUNT_AT);
        scheduleTransition(() => set({ isBorvisTransitioning: false }), ENTER_DONE_AT);
    },

    exitBorvis: () => {
        // Allow exit while open OR mid-enter (so a user can bail during the entrance).
        if (!get().isBorvisMode && !(get().isBorvisTransitioning && get().borvisTransitionDir === 'enter')) return;
        // Cancel any pending enter timers so a stale one can't re-open after exit.
        clearTransitionTimers();

        // Tear down audio immediately (mic capture is torn down by the overlay's
        // unmount cleanup). Status reset so re-entry starts clean.
        cancelSpeech();
        useAvatarStore.getState().setStatus('idle');
        startMusicFade(_savedMusicVol, 800);

        // Reverse transition: glitch cover in → overlay unmounts beneath it → reveal.
        set({ borvisTransitionDir: 'exit', isBorvisTransitioning: true });
        scheduleTransition(() => set({ isBorvisMode: false }), EXIT_UNMOUNT_AT);
        scheduleTransition(() => set({ isBorvisTransitioning: false }), EXIT_DONE_AT);
    },
}));
