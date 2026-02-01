/**
 * Layout Module Types (Row Structure)
 * 
 * 这些是定义内容排列方式的布局模块。
 * These are the layout modules that define how content is arranged.
 */

// 全宽布局 - 单列/全宽
export const layoutFullWidth = {
    name: 'layoutFullWidth',
    title: 'Full Width Row / 全宽行',
    type: 'object',
    icon: () => '▭',
    fields: [
        {
            name: 'anchorId',
            title: 'Anchor ID / 锚点ID',
            type: 'string',
            description: 'For sidebar navigation / 用于侧边栏快速导航',
        },
        {
            name: 'content',
            title: 'Content / 内容',
            type: 'array',
            of: [
                { type: 'richTextBlock' },
                { type: 'mediaBlock' },
                { type: 'statsBlock' },
            ],
        },
        {
            name: 'background',
            title: 'Background Style / 背景样式',
            type: 'string',
            options: {
                list: [
                    { title: 'Transparent / 透明', value: 'transparent' },
                    { title: 'Dark Glass / 深色玻璃', value: 'dark-glass' },
                    { title: 'Outline / 边框', value: 'outline' },
                ],
                layout: 'radio',
            },
            initialValue: 'transparent',
        },
    ],
    preview: {
        select: {
            anchorId: 'anchorId',
        },
        prepare({ anchorId }: { anchorId?: string }) {
            return {
                title: `Full Width: ${anchorId || 'Untitled'}`,
                subtitle: '全宽行',
            };
        },
    },
};

// 分栏布局 - 双列
export const layoutSplit = {
    name: 'layoutSplit',
    title: 'Split Row (2 Columns) / 双栏行',
    type: 'object',
    icon: () => '▥',
    fields: [
        {
            name: 'anchorId',
            title: 'Anchor ID / 锚点ID',
            type: 'string',
            description: 'For sidebar navigation / 用于侧边栏快速导航',
        },
        {
            name: 'ratio',
            title: 'Column Ratio / 列比例',
            type: 'string',
            options: {
                list: [
                    { title: '50/50 (Equal)', value: '50-50' },
                    { title: '40/60 (Left Narrow)', value: '40-60' },
                    { title: '60/40 (Right Narrow)', value: '60-40' },
                ],
                layout: 'radio',
            },
            initialValue: '50-50',
        },
        {
            name: 'leftSlot',
            title: 'Left Column / 左列',
            type: 'array',
            of: [
                { type: 'richTextBlock' },
                { type: 'mediaBlock' },
                { type: 'statsBlock' },
            ],
        },
        {
            name: 'rightSlot',
            title: 'Right Column / 右列',
            type: 'array',
            of: [
                { type: 'richTextBlock' },
                { type: 'mediaBlock' },
                { type: 'statsBlock' },
            ],
        },
    ],
    preview: {
        select: {
            ratio: 'ratio',
            anchorId: 'anchorId',
        },
        prepare({ ratio, anchorId }: { ratio?: string; anchorId?: string }) {
            return {
                title: `Split (${ratio}): ${anchorId || 'Untitled'}`,
                subtitle: '双栏行',
            };
        },
    },
};

// 网格布局 - 画廊/多列
export const layoutGrid = {
    name: 'layoutGrid',
    title: 'Grid Row (Gallery) / 网格行',
    type: 'object',
    icon: () => '▦',
    fields: [
        {
            name: 'anchorId',
            title: 'Anchor ID / 锚点ID',
            type: 'string',
            description: 'For sidebar navigation / 用于侧边栏快速导航',
        },
        {
            name: 'columns',
            title: 'Columns / 列数',
            type: 'number',
            options: {
                list: [
                    { title: '2 Columns', value: 2 },
                    { title: '3 Columns', value: 3 },
                    { title: '4 Columns', value: 4 },
                ],
            },
            initialValue: 3,
        },
        {
            name: 'items',
            title: 'Grid Items / 网格项',
            type: 'array',
            of: [
                { type: 'mediaBlock' },
                { type: 'statsBlock' },
            ],
        },
    ],
    preview: {
        select: {
            columns: 'columns',
            anchorId: 'anchorId',
        },
        prepare({ columns, anchorId }: { columns?: number; anchorId?: string }) {
            return {
                title: `Grid (${columns} cols): ${anchorId || 'Untitled'}`,
                subtitle: '网格行',
            };
        },
    },
};
