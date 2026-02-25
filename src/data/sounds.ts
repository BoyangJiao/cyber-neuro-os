export interface Sound {
    id: string;
    titleKey: string;
    icon: string;
    durationEstimateSec: number;
}

export const sounds: Sound[] = [
    {
        id: 'sys-boot',
        titleKey: 'synthesis.sounds.sysBoot',
        icon: '⚡️',
        durationEstimateSec: 3.5
    },
    {
        id: 'access-granted',
        titleKey: 'synthesis.sounds.accessGranted',
        icon: '✅',
        durationEstimateSec: 1.2
    },
    {
        id: 'access-denied',
        titleKey: 'synthesis.sounds.accessDenied',
        icon: '🚫',
        durationEstimateSec: 1.8
    },
    {
        id: 'data-transfer',
        titleKey: 'synthesis.sounds.dataTransfer',
        icon: '📡',
        durationEstimateSec: 5.0
    },
    {
        id: 'glitch-heavy',
        titleKey: 'synthesis.sounds.glitchHeavy',
        icon: '💥',
        durationEstimateSec: 2.1
    },
    {
        id: 'scan-complete',
        titleKey: 'synthesis.sounds.scanComplete',
        icon: '👁️',
        durationEstimateSec: 1.5
    },
    {
        id: 'notification',
        titleKey: 'synthesis.sounds.notification',
        icon: '💬',
        durationEstimateSec: 0.8
    },
    {
        id: 'warning-alarm',
        titleKey: 'synthesis.sounds.warningAlarm',
        icon: '⚠️',
        durationEstimateSec: 4.0
    }
];
