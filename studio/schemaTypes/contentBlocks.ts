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
                        { title: 'H1', value: 'h1' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'H4', value: 'h4' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
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
            name: 'videoEmbed',
            title: 'Video Embed Code / 视频嵌入代码 (iframe/script)',
            type: 'text',
            rows: 3,
            description: 'Paste the full embed code (iframe, script, etc.) from Vimeo/YouTube / 粘贴 Vimeo/YouTube 的完整嵌入代码',
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
            name: 'loop',
            title: 'Loop Video / 循环播放',
            type: 'boolean',
            description: 'Auto-loop video playback / 自动循环播放视频',
            initialValue: true,
        }),
        defineField({
            name: 'useCustomPlayer',
            title: 'Enable Custom Player / 启用自定义播放器',
            type: 'boolean',
            description: 'Enable interactive controls (Play/Pause, Volume, Progress) / 启用交互式控件（播放/暂停、音量、进度）',
            initialValue: false,
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

// 对比滑块块 - Before/After 对比展示
export const compareBlock = defineType({
    name: 'compareBlock',
    title: 'Comparison Slider / 对比滑块',
    type: 'object',
    icon: () => '⇔',
    fields: [
        // Before side
        defineField({
            name: 'beforeImage',
            title: 'Before Image / 前图片',
            type: 'image',
            options: { hotspot: true, accept: 'image/*' },
        }),
        defineField({
            name: 'beforeVideoFile',
            title: 'Before Video File / 前视频文件',
            type: 'file',
            options: { accept: 'video/*' },
        }),
        defineField({
            name: 'beforeVideo',
            title: 'Before Video URL / 前视频链接',
            type: 'url',
        }),
        defineField({
            name: 'beforeLabel',
            title: 'Before Label / 前标签',
            type: 'string',
            initialValue: 'BEFORE',
        }),
        // After side
        defineField({
            name: 'afterImage',
            title: 'After Image / 后图片',
            type: 'image',
            options: { hotspot: true, accept: 'image/*' },
        }),
        defineField({
            name: 'afterVideoFile',
            title: 'After Video File / 后视频文件',
            type: 'file',
            options: { accept: 'video/*' },
        }),
        defineField({
            name: 'afterVideo',
            title: 'After Video URL / 后视频链接',
            type: 'url',
        }),
        defineField({
            name: 'afterLabel',
            title: 'After Label / 后标签',
            type: 'string',
            initialValue: 'AFTER',
        }),
    ],
    preview: {
        select: {
            beforeLabel: 'beforeLabel',
            afterLabel: 'afterLabel',
        },
        prepare({ beforeLabel, afterLabel }: { beforeLabel?: string; afterLabel?: string }) {
            return {
                title: `Compare: ${beforeLabel || 'BEFORE'} ⇔ ${afterLabel || 'AFTER'}`,
            };
        },
    },
});

// 标签切换块 - Tab/Segment Control
export const tabBlock = defineType({
    name: 'tabBlock',
    title: 'Tab Panel / 标签面板',
    type: 'object',
    icon: () => '⊞',
    fields: [
        defineField({
            name: 'tabs',
            title: 'Tabs / 标签页',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'tabItem',
                    title: 'Tab',
                    fields: [
                        defineField({
                            name: 'label',
                            title: 'Label / 标签名',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'image',
                            title: 'Image / 图片',
                            type: 'image',
                            options: { hotspot: true, accept: 'image/*' },
                        }),
                        defineField({
                            name: 'videoFile',
                            title: 'Video File / 视频文件',
                            type: 'file',
                            options: { accept: 'video/*' },
                        }),
                        defineField({
                            name: 'video',
                            title: 'Video URL / 视频链接',
                            type: 'url',
                        }),
                    ],
                    preview: {
                        select: { label: 'label' },
                        prepare({ label }: { label?: string }) {
                            return { title: label || 'Untitled Tab' };
                        },
                    },
                },
            ],
            validation: (Rule) => Rule.min(2).error('At least 2 tabs are required / 至少需要2个标签'),
        }),
    ],
    preview: {
        select: {
            tabs: 'tabs',
        },
        prepare({ tabs }: { tabs?: { label?: string }[] }) {
            const labels = tabs?.map(t => t.label).filter(Boolean).join(' | ') || 'Empty';
            return {
                title: `Tabs: ${labels}`,
            };
        },
    },
});
