// Schema for a modular project section
// Copy this to your Sanity Studio schema folder

export default {
    name: 'projectSection',
    title: 'Project Section',
    type: 'object',
    fields: [
        {
            name: 'title',
            title: 'Section Title',
            type: 'string',
            description: 'e.g., "01. Context" or "The Challenge"',
        },
        {
            name: 'theme',
            title: 'Theme & Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Context (Problem/Background)', value: 'context' },
                    { title: 'Strategy (Insight/Approach)', value: 'strategy' },
                    { title: 'Highlight (Key Visuals)', value: 'highlights' },
                    { title: 'Outcome (Results/Reflection)', value: 'outcome' },
                    { title: 'Default / Generic', value: 'default' },
                ],
                layout: 'radio',
            },
            initialValue: 'default',
        },
        {
            name: 'layout',
            title: 'Layout Style',
            type: 'string',
            options: {
                list: [
                    { title: 'Left Sidebar (Standard)', value: 'left-sidebar' },
                    { title: 'Full Width (Immersive)', value: 'full-width' },
                    { title: 'Media Right (Split)', value: 'media-right' },
                ],
                layout: 'radio',
            },
            initialValue: 'left-sidebar',
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
        },
        {
            name: 'media',
            title: 'Media Asset',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'theme',
            media: 'media',
        },
    },
};
