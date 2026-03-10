export interface LabApp {
    id: string;
    titleKey: string;
    descKey: string;
    image: string;
    componentType: string; // Identifier for when real components are loaded
    geometryType?: any;
    status: 'ACTIVE' | 'ARCHIVED' | 'DEVELOPMENT';
    iframeUrl?: string; // Optional URL for embedding the app via iframe
}

export const labApps: LabApp[] = [
    {
        id: 'avatar-generator',
        titleKey: 'lab.apps.avatarGenerator.title',
        descKey: 'lab.apps.avatarGenerator.desc',
        image: '/reference/camera.svg',
        componentType: 'AvatarGenerator',
        geometryType: 'camera',
        status: 'ACTIVE',
        iframeUrl: 'https://generator.boyangjiao.xyz'
    },
    {
        id: 'ai-ready-guide',
        titleKey: 'lab.apps.aiReadyGuide.title',
        descKey: 'lab.apps.aiReadyGuide.desc',
        image: '/reference/book.svg',
        componentType: 'AIReadyGuide',
        geometryType: 'book',
        status: 'ACTIVE',
        iframeUrl: 'https://dsguide.boyangjiao.xyz'
    },
    {
        id: 'coming-soon',
        titleKey: 'lab.apps.comingSoon.title',
        descKey: 'lab.apps.comingSoon.desc',
        image: 'ri-lock-2-line',
        componentType: 'ClassifiedProject',
        geometryType: 'lab',
        status: 'DEVELOPMENT'
    }
];
