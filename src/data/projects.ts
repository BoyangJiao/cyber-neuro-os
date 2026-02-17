export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    status: 'DEPLOYED' | 'IN_DEVELOPMENT' | 'CLASSIFIED' | 'Live' | 'Archived' | 'In Development';
    thumbnail: string;
    videoFile?: string;
    video?: string;
    projectType?: string | string[];  // e.g. 'UI/UX', 'Game', 'Web3'
    timeline?: string;     // e.g. '2024'
    liveUrl?: string;      // Live project URL
    sortOrder?: number;
}

export const projects: Project[] = [];

