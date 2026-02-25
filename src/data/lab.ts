export interface LabApp {
    id: string;
    titleKey: string;
    descKey: string;
    image: string;
    componentType: string; // Identifier for when real components are loaded
    status: 'ACTIVE' | 'ARCHIVED' | 'DEVELOPMENT';
}

export const labApps: LabApp[] = [
    {
        id: 'color-decoder',
        titleKey: 'lab.apps.colorDecoder.title',
        descKey: 'lab.apps.colorDecoder.desc',
        image: '/images/features/lab_active.png',
        componentType: 'ColorDecoder',
        status: 'ACTIVE'
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
