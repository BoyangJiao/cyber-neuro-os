import * as Tone from 'tone';
import { useCallback, useRef } from 'react';

export const useSoundSystem = () => {
    // Refs to keep synths persistent across renders
    const hoverSynth = useRef<Tone.Synth | null>(null);
    const clickSynth = useRef<Tone.MembraneSynth | null>(null);
    const isInitialized = useRef(false);

    const initAudio = useCallback(async () => {
        if (isInitialized.current) return;

        await Tone.start();

        // Simple synth for high-pitch hover blips
        hoverSynth.current = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0,
                release: 0.1,
            },
        }).toDestination();
        hoverSynth.current.volume.value = -15; // Quieter

        // Membrane synth for mechanical clicks
        clickSynth.current = new Tone.MembraneSynth({
            pitchDecay: 0.008,
            octaves: 2,
            oscillator: { type: 'square' },
            envelope: {
                attack: 0.001,
                decay: 0.2,
                sustain: 0,
                release: 0.1,
            },
        }).toDestination();
        clickSynth.current.volume.value = -10;

        isInitialized.current = true;
        console.log('Audio System Initialized');
    }, []);

    const playHover = useCallback(() => {
        if (!isInitialized.current) initAudio();
        hoverSynth.current?.triggerAttackRelease("C6", "32n");
    }, [initAudio]);

    const playClick = useCallback(() => {
        if (!isInitialized.current) initAudio();
        clickSynth.current?.triggerAttackRelease("C2", "16n");
    }, [initAudio]);

    return { initAudio, playHover, playClick };
};
