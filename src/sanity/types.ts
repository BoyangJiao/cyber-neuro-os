/**
 * Sanity Type Definitions
 * 
 * Shared types for Sanity data structures used across the application.
 */

// Raw Sanity project from PROJECTS_QUERY
export interface SanityProjectRaw {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    sortOrder?: number;

    status?: string;
    techStack?: string[];
    projectType?: string;
    timeline?: string;
    liveUrl?: string;
    heroImage?: string;
    heroVideoFile?: string;
    heroVideoUrl?: string;
}
