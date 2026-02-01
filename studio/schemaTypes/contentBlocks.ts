import { defineType, defineField } from 'sanity';

/**
 * Content Block Types (Slot Content)
 * 
 * 这些是可以放入布局模块"插槽"中的内容块。
 * These are the content blocks that can be placed inside layout module "slots".
 */

// 富文本块 - 极简 Portable Text 编辑器
export const richTextBlock = defineType({
    name: 'richTextBlock',
    title: 'Rich Text / 富文本',
    type: 'object',
    icon: () => '📝',
    fields: [
        defineField({
            name: 'content',
            title: 'Content / 内容',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H3', value: 'h3' },
                        { title: 'H4', value: 'h4' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Strong', value: 'strong' },
                            { title: 'Emphasis', value: 'em' },
                            { title: 'Code', value: 'code' },
                        ],
                    },
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Rich Text Block' };
        },
    },
});

// 媒体块 - 图片或视频，带布局选项和说明文字
export const mediaBlock = defineType({
    name: 'mediaBlock',
    title: 'Media / 媒体',
    type: 'object',
    icon: () => '🖼️',
    fields: [
        defineField({
            name: 'image',
            title: 'Image / 图片 (supports GIF / 支持GIF动图)',
            type: 'image',
            options: {
                hotspot: true,
                accept: 'image/*',
            },
        }),
        defineField({
            name: 'videoFile',
            title: 'Video File / 视频文件',
            type: 'file',
            description: 'Upload local video file (MP4, WebM, MOV) / 上传本地视频文件',
            options: {
                accept: 'video/*',
            },
        }),
        defineField({
            name: 'video',
            title: 'Video URL / 视频链接 (外部链接)',
            type: 'url',
            description: 'YouTube, Vimeo, or direct video URL / 或使用视频链接',
        }),
        defineField({
            name: 'caption',
            title: 'Caption / 说明',
            type: 'string',
        }),
        defineField({
            name: 'alt',
            title: 'Alt Text / 替代文本',
            type: 'string',
            description: 'For accessibility / 用于无障碍访问',
        }),
        defineField({
            name: 'layout',
            title: 'Layout / 布局',
            type: 'string',
            options: {
                list: [
                    { title: 'Cover (Fill) / 填充', value: 'cover' },
                    { title: 'Contain (Fit) / 适应', value: 'contain' },
                    { title: 'Auto / 自动', value: 'auto' },
                ],
                layout: 'radio',
            },
            initialValue: 'cover',
        }),
    ],
    preview: {
        select: {
            media: 'image',
            caption: 'caption',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prepare({ media, caption }: { media?: any; caption?: string }) {
            return {
                title: caption || 'Media Block',
                media: media,
            };
        },
    },
});

// 统计数据块 - 指标/KPI 展示
export const statsBlock = defineType({
    name: 'statsBlock',
    title: 'Stats / 数据指标',
    type: 'object',
    icon: () => '📊',
    fields: [
        defineField({
            name: 'items',
            title: 'Metrics / 指标列表',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'label',
                            type: 'string',
                            title: 'Label / 标签',
                            description: 'e.g., "Conversion Rate" / 例如："转化率"',
                        },
                        {
                            name: 'value',
                            type: 'string',
                            title: 'Value / 数值',
                            description: 'e.g., "+24%" / 例如："+24%"',
                        },
                        {
                            name: 'description',
                            type: 'string',
                            title: 'Description / 描述',
                            description: 'Optional context / 可选的补充说明',
                        },
                    ],
                    preview: {
                        select: {
                            label: 'label',
                            value: 'value',
                        },
                        prepare({ label, value }: { label?: string; value?: string }) {
                            return { title: `${label}: ${value}` };
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            items: 'items',
        },
        prepare({ items }: { items?: { label?: string; value?: string }[] }) {
            return {
                title: `Stats Block (${items?.length || 0} metrics)`,
            };
        },
    },
});
