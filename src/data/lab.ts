export interface LabApp {
    id: string;
    titleKey: string;
    descKey: string;
    image: string;
    componentType: string; // Identifier for when real components are loaded
    status: 'ACTIVE' | 'ARCHIVED' | 'DEVELOPMENT';
    iframeUrl?: string; // Optional URL for embedding the app via iframe
}

export const labApps: LabApp[] = [
    {
        id: 'avatar-generator',
        titleKey: 'lab.apps.avatarGenerator.title',
        descKey: 'lab.apps.avatarGenerator.desc',
        image: '/images/features/Lab_active.png',
        componentType: 'AvatarGenerator',
        status: 'ACTIVE',
        iframeUrl: 'https://avatar-generator-ruby.vercel.app/'
    },
    {
        id: 'hash-generator',
        titleKey: 'lab.apps.hashGen.title',
        descKey: 'lab.apps.hashGen.desc',
        image: '/images/features/game_active.png',
        componentType: 'HashGenerator',
        status: 'DEVELOPMENT'
    },
    {
        id: 'base64-terminal',
        titleKey: 'lab.apps.base64Term.title',
        descKey: 'lab.apps.base64Term.desc',
        image: '/images/features/SFX_active.png',
        componentType: 'Base64Terminal',
        status: 'ARCHIVED'
    }
];
