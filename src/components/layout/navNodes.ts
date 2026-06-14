/**
 * Shared navigation node data — consumed by the desktop Header dock and the
 * mobile NavDrawer so the two menus can never drift apart.
 */
export interface NavNodeData {
    id: string;
    titleKey: string;
    link?: string;
}

export const NAV_NODES: NavNodeData[] = [
    { id: 'project', titleKey: 'features.project', link: '/projects' },
    { id: 'game', titleKey: 'features.game', link: '/games' },
    { id: 'music', titleKey: 'features.music', link: '/music' },
    { id: 'lab', titleKey: 'features.lab', link: '/lab' },
    { id: 'sound', titleKey: 'features.sound', link: '/synthesis' },
    { id: 'video', titleKey: 'features.video' },
];
