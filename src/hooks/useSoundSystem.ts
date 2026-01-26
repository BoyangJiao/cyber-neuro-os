import * as Tone from 'tone';
import { useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useSoundSystem = () => {
    // Refs to keep synths persistent across renders
    const hoverSynth = useRef<Tone.Synth | null>(null);
    const clickSynth = useRef<Tone.MembraneSynth | null>(null);
    const isInitialized = useRef(false);

    const { sfxVolume } = useAppStore();

    const updateVolumes = useCallback(() => {
        if (!hoverSynth.current || !clickSynth.current) return;

        // Base volumes at 50% setting
        const HOVER_BASE_DB = -15;
        const CLICK_BASE_DB = -10;

        if (sfxVolume === 0) {
            hoverSynth.current.volume.value = -Infinity;
            clickSynth.current.volume.value = -Infinity;
        } else {
            // Calculate gain relative to 50% (where 50 = 1x gain)
            // Using a log-like curve for natural volume feeling
            // but for simplicity 20*log10(ratio) works well for audio
            const ratio = sfxVolume / 50;
            const dbAdjustment = 20 * Math.log10(ratio);

            hoverSynth.current.volume.value = HOVER_BASE_DB + dbAdjustment;
            clickSynth.current.volume.value = CLICK_BASE_DB + dbAdjustment;
        }
    }, [sfxVolume]);

    const initAudio = useCallback(async () => {
        if (isInitialized.current) return;

        await Tone.start();

        // Simple synth for high-pitch hover blips
        hoverSynth.current = new Tone.Synth({
            oscillator: { type: 'sine' },
            volume: -15, // Initial dummy, updated immediately below
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0,
                release: 0.1,
            },
        }).toDestination();

        // Membrane synth for mechanical clicks
        clickSynth.current = new Tone.MembraneSynth({
            pitchDecay: 0.008,
            octaves: 2,
            oscillator: { type: 'square' },
            volume: -10, // Initial dummy
            envelope: {
                attack: 0.001,
                decay: 0.2,
                sustain: 0,
                release: 0.1,
            },
        }).toDestination();

        isInitialized.current = true;
        updateVolumes();
    }, [updateVolumes]);

    // Update volume when store changes
    useEffect(() => {
        if (isInitialized.current) {
            updateVolumes();
        }
    }, [sfxVolume, updateVolumes]);

    const playHover = useCallback(() => {
        if (!isInitialized.current) initAudio();
        // Ensure volume is correct before playing (in case init was just called)
        if (hoverSynth.current && hoverSynth.current.volume.value === -Infinity && sfxVolume > 0) {
            updateVolumes();
        }
        hoverSynth.current?.triggerAttackRelease("C6", "32n");
    }, [initAudio, sfxVolume, updateVolumes]);

    const playClick = useCallback(() => {
        if (!isInitialized.current) initAudio();
        clickSynth.current?.triggerAttackRelease("C2", "16n");
    }, [initAudio]);

    return { initAudio, playHover, playClick };
};
