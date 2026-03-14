import * as Tone from 'tone';
import { useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

// Singleton state to avoid re-initialization across hook instances
let globalInitialized = false;
let globalLoading = false;
let globalHoverPlayer: Tone.Player | null = null;
let globalCardHoverPlayer: Tone.Player | null = null;
let globalClickPlayer: Tone.Player | null = null;
let globalTransitionPlayer: Tone.Player | null = null;
let globalAlertPlayer: Tone.Player | null = null;

export const useSoundSystem = () => {
    // Refs for samplers and players
    const hoverPlayer = useRef<Tone.Player | null>(null);
    const cardHoverPlayer = useRef<Tone.Player | null>(null);
    const clickPlayer = useRef<Tone.Player | null>(null);
    const transitionPlayer = useRef<Tone.Player | null>(null);
    const alertPlayer = useRef<Tone.Player | null>(null);
    const isInitialized = useRef(false);
    const isLoading = useRef(false);

    const sfxVolume = useAppStore(state => state.sfxVolume);

    // Sync from global singleton
    const syncWithGlobal = useCallback(() => {
        hoverPlayer.current = globalHoverPlayer;
        cardHoverPlayer.current = globalCardHoverPlayer;
        clickPlayer.current = globalClickPlayer;
        transitionPlayer.current = globalTransitionPlayer;
        alertPlayer.current = globalAlertPlayer;
        isInitialized.current = globalInitialized;
        isLoading.current = globalLoading;
    }, []);

    const updateVolumes = useCallback(() => {
        if (!hoverPlayer.current || !cardHoverPlayer.current || !clickPlayer.current || !transitionPlayer.current || !alertPlayer.current) return;

        // Base volumes at 50% setting
        const HOVER_BASE_DB = -5;
        const CLICK_BASE_DB = 0;
        const TRANSITION_BASE_DB = -3;

        if (sfxVolume === 0) {
            const inf = -Infinity;
            hoverPlayer.current.volume.value = inf;
            cardHoverPlayer.current.volume.value = inf;
            clickPlayer.current.volume.value = inf;
            transitionPlayer.current.volume.value = inf;
            alertPlayer.current.volume.value = inf;
        } else {
            const ratio = sfxVolume / 50;
            const dbAdjustment = 20 * Math.log10(ratio);

            hoverPlayer.current.volume.value = HOVER_BASE_DB + dbAdjustment;
            cardHoverPlayer.current.volume.value = HOVER_BASE_DB + dbAdjustment;
            clickPlayer.current.volume.value = CLICK_BASE_DB + dbAdjustment;
            transitionPlayer.current.volume.value = TRANSITION_BASE_DB + dbAdjustment;
            alertPlayer.current.volume.value = -2 + dbAdjustment;
        }
    }, [sfxVolume]);

    const initAudio = useCallback(async () => {
        syncWithGlobal();
        if (isInitialized.current || isLoading.current) return;

        globalLoading = true;
        isLoading.current = true;

        try {
            if (import.meta.env.DEV) console.log("[SoundSystem] Optimizing: Loading audio buffers early...");

            // Define players
            globalHoverPlayer = new Tone.Player({
                url: '/sounds/hover/beep.mp3',
                volume: -5,
                autostart: false,
            }).toDestination();

            globalCardHoverPlayer = new Tone.Player({
                url: '/sounds/hover/Interface_Neutral_Simple_074.mp3',
                volume: -5,
                autostart: false,
            }).toDestination();

            globalClickPlayer = new Tone.Player({
                url: '/sounds/click/Interface_Access_Granted_091.mp3',
                volume: 0,
                autostart: false,
            }).toDestination();

            globalTransitionPlayer = new Tone.Player({
                url: '/sounds/transition/Interface_Glitch_079.mp3',
                volume: -3,
                autostart: false,
            }).toDestination();

            globalAlertPlayer = new Tone.Player({
                url: '/sounds/access/Interface_Access_Denied_117.mp3',
                volume: -2,
                autostart: false,
            }).toDestination();

            // Perform context start (if interaction happened)
            if (Tone.context.state !== 'running') {
                Tone.start().catch(() => {
                    console.warn("[SoundSystem] Context not started because of user interaction required");
                });
            }

            // High priority buffer loading
            await Tone.loaded();

            globalInitialized = true;
            globalLoading = false;
            syncWithGlobal();

            updateVolumes();
            if (import.meta.env.DEV) console.log("[SoundSystem] Fast boot complete. All buffers loaded and ready.");
        } catch (err) {
            console.error("[SoundSystem] Pre-init failed:", err);
            globalLoading = false;
            isLoading.current = false;
        }
    }, [updateVolumes, syncWithGlobal]);

    // Initial sync
    useEffect(() => {
        syncWithGlobal();
    }, [syncWithGlobal]);

    // Update volume when store changes
    useEffect(() => {
        if (isInitialized.current) {
            updateVolumes();
        }
    }, [sfxVolume, updateVolumes]);

    const playHover = useCallback((variant: 'default' | 'card' = 'default') => {
        if (!isInitialized.current) {
            initAudio();
            return;
        }

        const player = variant === 'card' ? cardHoverPlayer.current : hoverPlayer.current;

        if (player?.loaded) {
            if (player.state === 'started') player.stop();
            player.start();
        }
    }, [initAudio]);

    const playAlert = useCallback(() => {
        if (!isInitialized.current) {
            initAudio();
        }

        if (alertPlayer.current?.loaded) {
            if (alertPlayer.current.state === 'started') alertPlayer.current.stop();
            alertPlayer.current.start();
        }
    }, [initAudio]);

    const playClick = useCallback(() => {
        if (!isInitialized.current) {
            initAudio();
        }

        if (clickPlayer.current?.loaded) {
            if (clickPlayer.current.state === 'started') clickPlayer.current.stop();
            clickPlayer.current.start();
        }
    }, [initAudio]);

    const playTransition = useCallback(() => {
        if (!isInitialized.current) {
            initAudio();
        }

        if (transitionPlayer.current?.loaded) {
            if (transitionPlayer.current.state === 'started') transitionPlayer.current.stop();
            transitionPlayer.current.start();
        }
    }, [initAudio]);

    return { initAudio, playHover, playClick, playTransition, playAlert };
};
