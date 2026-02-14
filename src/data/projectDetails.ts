/**
 * Sanity Project Types
 * 
 * This file contains type definitions for project data coming from Sanity CMS.
 */

// ============================================
// Sanity Type Aliases
// ============================================

/** Sanity image reference object (from @sanity/image-url) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SanityImageObject = Record<string, any>;

/** Portable Text block array */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextContent = any[];

// ============================================
// Content Block Types (Slot Content)
// 内容块类型（插槽内容）
// ============================================

export interface RichTextBlock {
    _key: string;
    _type: 'richTextBlock';
    content: PortableTextContent;
}

export interface MediaBlock {
    _key: string;
    _type: 'mediaBlock';
    image?: SanityImageObject;
    videoFile?: { asset: { url: string } }; // Sanity file reference
    video?: string; // External URL
    videoEmbed?: string;
    caption?: string;
    alt?: string;
    loop?: boolean;
    useCustomPlayer?: boolean;
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

export interface CompareBlock {
    _key: string;
    _type: 'compareBlock';
    beforeImage?: SanityImageObject;
    beforeVideoFile?: { asset: { url: string } };
    beforeVideo?: string;
    beforeLabel?: string;
    afterImage?: SanityImageObject;
    afterVideoFile?: { asset: { url: string } };
    afterVideo?: string;
    afterLabel?: string;
}

export interface TabItem {
    _key: string;
    label: string;
    image?: SanityImageObject;
    videoFile?: { asset: { url: string } };
    video?: string;
}

export interface TabBlock {
    _key: string;
    _type: 'tabBlock';
    tabs: TabItem[];
}

export type ContentBlock = RichTextBlock | MediaBlock | StatsBlock | CompareBlock | TabBlock;

// ============================================
// Layout Module Types (Row Structure)
// 布局模块类型（行结构）
// ============================================

export interface LayoutFullWidth {
    _key: string;
    _type: 'layoutFullWidth';
    anchorId?: string;
    content: ContentBlock[];
    paddingTop?: number;
    paddingBottom?: number;
    showBottomBorder?: boolean;
}

export interface LayoutSplit {
    _key: string;
    _type: 'layoutSplit';
    anchorId?: string;
    ratio: '50-50' | '40-60' | '60-40';
    leftSlot: ContentBlock[];
    rightSlot: ContentBlock[];
    paddingTop?: number;
    paddingBottom?: number;
    showBottomBorder?: boolean;
}

export interface LayoutGrid {
    _key: string;
    _type: 'layoutGrid';
    anchorId?: string;
    columns: 2 | 3 | 4;
    items: ContentBlock[];
    paddingTop?: number;
    paddingBottom?: number;
    showBottomBorder?: boolean;
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
    heroImage?: SanityImageObject;
    heroVideoFile?: string;
    heroVideoUrl?: string;
    coreMetrics?: CoreMetric[];
    sidebar?: ProjectSidebar;
    contentModules?: LayoutModule[];
}
