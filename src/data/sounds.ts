export interface Sound {
    id: string;
    titleKey: string;
    icon: string;
    durationEstimateSec: number;
    audioSrc: string;
}

export const sounds: Sound[] = [
    {
        id: 'access-granted',
        titleKey: 'synthesis.sounds.accessGranted',
        icon: '✅',
        durationEstimateSec: 1.2,
        audioSrc: '/sounds/click/Interface_Access_Granted_091.mp3'
    },
    {
        id: 'access-denied',
        titleKey: 'synthesis.sounds.accessDenied',
        icon: '🚫',
        durationEstimateSec: 1.8,
        audioSrc: '/sounds/access/Interface_Access_Denied_117.mp3'
    },
    {
        id: 'system-glitch',
        titleKey: 'synthesis.sounds.systemGlitch',
        icon: '💥',
        durationEstimateSec: 2.1,
        audioSrc: '/sounds/transition/Interface_Glitch_079.mp3'
    },
    {
        id: 'ui-hover',
        titleKey: 'synthesis.sounds.uiHover',
        icon: '💬',
        durationEstimateSec: 0.8,
        audioSrc: '/sounds/hover/beep.mp3'
    }
];
