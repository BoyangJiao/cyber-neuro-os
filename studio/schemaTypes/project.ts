// Schema for the Project document
// Copy this to your Sanity Studio schema folder

export default {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Project Title',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
        },

        {
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'coreMetrics',
            title: 'Core Metrics',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', type: 'string', title: 'Label' },
                        { name: 'value', type: 'string', title: 'Value' },
                        { name: 'unit', type: 'string', title: 'Unit' },
                    ],
                },
            ],
        },
        {
            name: 'sidebar',
            title: 'Sidebar Info',
            type: 'object',
            fields: [
                { name: 'role', type: 'string', title: 'Role' },
                { name: 'team', type: 'string', title: 'Team' },
                { name: 'timeline', type: 'string', title: 'Timeline' },
                {
                    name: 'status',
                    title: 'Status',
                    type: 'string',
                    options: {
                        list: ['Live', 'In Development', 'Archived'],
                    },
                },
                { name: 'liveUrl', type: 'url', title: 'Live URL' },
                {
                    name: 'projectType',
                    title: 'Project Type (项目类型)',
                    type: 'array',
                    of: [{ type: 'string' }],
                },
                {
                    name: 'coreContributions',
                    title: 'Core Contributions',
                    type: 'array',
                    of: [{ type: 'string' }],
                },
            ],
        },
        {
            name: 'contentModules',
            title: 'Content Modules',
            description: 'Build your case study with flexible layout blocks / 使用灵活的布局块构建你的案例',
            type: 'array',
            of: [
                { type: 'layoutFullWidth' },
                { type: 'layoutSplit' },
                { type: 'layoutGrid' },
            ],
        },
    ],
};
