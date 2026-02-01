/**
 * Sanity Project Types
 * 
 * This file contains type definitions for project data coming from Sanity CMS.
 * NOTE: Legacy mock data has been removed. All data should now come from Sanity.
 */

// ============================================
// Content Block Types (Slot Content)
// 内容块类型（插槽内容）
// ============================================

export interface RichTextBlock {
    _key: string;
    _type: 'richTextBlock';
    content: any[]; // Portable Text
}

export interface MediaBlock {
    _key: string;
    _type: 'mediaBlock';
    image?: any; // Sanity image reference
    videoFile?: { asset: { url: string } }; // Sanity file reference
    video?: string; // External URL
    caption?: string;
    alt?: string;
    layout: 'cover' | 'contain' | 'auto';
}

export interface StatsItem {
    label: string;
    value: string;
    description?: string;
}

export interface StatsBlock {
    _key: string;
    _type: 'statsBlock';
    items: StatsItem[];
}

export type ContentBlock = RichTextBlock | MediaBlock | StatsBlock;

// ============================================
// Layout Module Types (Row Structure)
// 布局模块类型（行结构）
// ============================================

export interface LayoutFullWidth {
    _key: string;
    _type: 'layoutFullWidth';
    anchorId?: string;
    background?: 'transparent' | 'dark-glass' | 'outline';
    content: ContentBlock[];
}

export interface LayoutSplit {
    _key: string;
    _type: 'layoutSplit';
    anchorId?: string;
    ratio: '50-50' | '40-60' | '60-40';
    leftSlot: ContentBlock[];
    rightSlot: ContentBlock[];
}

export interface LayoutGrid {
    _key: string;
    _type: 'layoutGrid';
    anchorId?: string;
    columns: 2 | 3 | 4;
    items: (MediaBlock | StatsBlock)[];
}

export type LayoutModule = LayoutFullWidth | LayoutSplit | LayoutGrid;

// ============================================
// Core Metrics & Sidebar (unchanged)
// ============================================

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
    liveUrl?: string;
    projectType?: string[];
    coreContributions: string[];
}

// ============================================
// Full Project Detail (updated)
// ============================================

export interface SanityProjectDetail {
    _id: string;
    title: string;
    slug: string;
    tagline?: string;
    heroImage?: any;
    coreMetrics?: CoreMetric[];
    sidebar?: ProjectSidebar;
    contentModules?: LayoutModule[];
}

// ============================================
// Legacy Types (deprecated)
// ============================================

/**
 * @deprecated Legacy interface - Use SanityProjectDetail instead.
 * Kept for backward compatibility only.
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

/** @deprecated Legacy fallback storage - All data should now come from Sanity. */
const legacyProjectDetails: Record<string, ProjectDetail> = {};

/**
 * @deprecated Use Sanity query instead: PROJECT_DETAIL_QUERY from sanity/queries.ts
 */
export const getProjectDetail = (projectId: string): ProjectDetail | undefined => {
    return legacyProjectDetails[projectId];
};
