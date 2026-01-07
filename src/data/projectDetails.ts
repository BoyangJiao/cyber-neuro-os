/**
 * Sanity Project Types
 * 
 * This file contains type definitions for project data coming from Sanity CMS.
 * NOTE: Legacy mock data has been removed. All data should now come from Sanity.
 */

// Sanity content module interface
export interface SanityProjectModule {
    _key: string;
    title: string;
    theme: 'context' | 'strategy' | 'highlights' | 'outcome' | 'default';
    layout: 'left-sidebar' | 'full-width' | 'media-right';
    content: any[]; // Portable Text content
    media?: any; // Sanity image reference
}

// Core metrics displayed in hero section
export interface CoreMetric {
    label: string;
    value: string;
    unit?: string;
}

// Sidebar information for project detail
export interface ProjectSidebar {
    role: string;
    team: string;
    timeline: string;
    status: 'Live' | 'In Development' | 'Archived';
    liveLink?: string;
    techStack: string[];
    coreContributions: string[];
}

// Full project detail from Sanity
export interface SanityProjectDetail {
    _id: string;
    title: string;
    slug: string;
    tagline?: string;
    heroImage?: string;
    coreMetrics?: CoreMetric[];
    sidebar?: ProjectSidebar;
    contentModules?: SanityProjectModule[];
}

/**
 * @deprecated Legacy interface - kept for backward compatibility during migration
 * Use SanityProjectDetail instead
 */
export interface ProjectDetail {
    projectId: string;
    tagline: string;
    heroImage: string;
    coreMetrics: CoreMetric[];
    sidebar: ProjectSidebar;
    sections: {
        hook: { title: string; content: string };
        context: { title: string; challenge: string; background: string };
        strategy: { title: string; insights: string[]; approach: string };
        highlights: { title: string; items: { title: string; description: string; image?: string }[] };
        outcome: { title: string; results: string[]; reflection: string };
    };
}

// Legacy mock data storage - kept as fallback only
// TODO: Remove once Sanity data migration is complete
const legacyProjectDetails: Record<string, ProjectDetail> = {};

/**
 * Get project detail by ID
 * @deprecated Use Sanity query instead: PROJECT_DETAIL_QUERY from sanity/queries.ts
 */
export const getProjectDetail = (projectId: string): ProjectDetail | undefined => {
    return legacyProjectDetails[projectId];
};
