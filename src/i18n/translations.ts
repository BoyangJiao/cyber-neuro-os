/**
 * Translations for UI text content
 * Supports English (en) and Chinese (zh)
 */

export const translations = {
    en: {
        // Header
        header: {
            brand: 'NEURO',
            brandHighlight: '.OS',
            online: 'Online',
        },

        // Footer
        footer: {
            neuralUplink: 'NEURAL UPLINK',
            settings: 'SETTINGS',
        },

        // Feature Panel
        features: {
            project: 'ARCHIVES',
            video: 'VISION',
            game: 'SIMULATION',
            sound: 'SYNTHESIS',
            music: 'BROADCAST',
            lab: 'LAB',
        },

        // Music Page
        music: {
            nowPlaying: 'NOW PLAYING',
        },

        // Profile Sidebar
        profile: {
            name: 'NAME',
            nameValue: 'BOYANG JIAO',
            occupation: 'OCCUPATION',
            occupationValue: 'DESIGNER & BUILDER',
            corporation: 'CORPORATION',
            corporationValue: 'ANT GROUP',
            activeQuest: 'ACTIVE QUEST',
            activeQuestValue: 'Bettr',
            aboutMe: 'ABOUT ME',
        },

        // About Me Page
        about: {
            title: 'WHO IS BOYANG JIAO',
            workExperience: {
                label: 'THE SHORT INTRODUCTION OF JOURNEY IN ANT GROUP',
                content: 'I have tackled challenges for both consumer products Alipay+ Digital Wallet and Alipay+ Rewards, which provide accessible, customizable, and sustainable inclusive finance solutions in APAC and African markets.',
            },
            careerAndDesign: {
                label: 'CAREER AND DESIGN',
                content: 'I have experience across a large spectrum of projects ranging from mobile apps, websites, and new retail services for consumers, SMEs, corporations, and nonprofits. Areas include Fintech, social media, gaming, e-commerce, education, and automobile.',
            },
            educationAndPassions: {
                label: 'BRIEF OF EDUCATION AND PERSONAL PASSIONS',
                content: "I'm originally from Hangzhou, China, and I have a bachelor's degree in Psychology from the University of Missouri and a master's degree in Human-Computer Interaction design from California College of the Arts (CCA). My Passions are social Impact, systems thinking, accessibility, and lifetime learning.",
            },
        },

        // Settings Modal
        settings: {
            title: 'SETTINGS',
            language: 'LANGUAGE',
            languageDesc: 'Select display language',
            mode3d: '3D MODE',
            close: 'CLOSE',
        },

        // Boot Screen
        boot: {
            initializing: 'INITIALIZING NEURAL INTERFACE',
            connecting: 'CONNECTING TO CORTEX',
            loading: 'LOADING PERSONALITY MATRIX',
            ready: 'SYSTEM READY',
        },

        // Biometric Monitor
        biometric: {
            sysMon: 'SYS.MON',
            cortex: 'CORTEX',
            sync: 'SYNC',
            stable: 'STABLE',
            vitals: 'VITALS',
            normal: 'NORMAL',
            stress: 'STRESS',
            overload: 'OVERLOAD',
            illness: 'ILLNESS',
            energy: 'ENERGY',
        },
    },

    zh: {
        // Header
        header: {
            brand: '神经操作系统',
            brandHighlight: '',
            online: '在线',
        },

        // Footer
        footer: {
            neuralUplink: '神经链接',
            settings: '设置',
        },

        // Feature Panel
        features: {
            project: '项目',
            video: '视频',
            game: '游戏',
            sound: '声音',
            music: '音乐',
            lab: '实验室',
        },

        // Music Page
        music: {
            nowPlaying: '正在播放',
        },

        // Profile Sidebar
        profile: {
            name: '姓名',
            nameValue: '焦柏炀',
            occupation: '职业',
            occupationValue: '设计师 & 开发者',
            corporation: '公司',
            corporationValue: '蚂蚁集团',
            activeQuest: '当前任务',
            activeQuestValue: 'Bettr',
            aboutMe: '关于我',
        },

        // About Me Page
        about: {
            title: '焦柏炀是谁',
            workExperience: {
                label: '蚂蚁集团工作经历简介',
                content: '我负责过 Alipay+ Digital Wallet 和 Alipay+ Rewards 两款消费者产品的设计挑战，为亚太和非洲市场提供易用、可定制且可持续的普惠金融解决方案。',
            },
            careerAndDesign: {
                label: '职业与设计',
                content: '我拥有广泛的项目经验，涵盖移动应用、网站和新零售服务，服务对象包括消费者、中小企业、大型企业和非营利组织。涉及领域包括金融科技、社交媒体、游戏、电商、教育和汽车。',
            },
            educationAndPassions: {
                label: '教育背景与个人热情',
                content: '我来自中国杭州，本科毕业于密苏里大学心理学专业，硕士毕业于加州艺术学院（CCA）人机交互设计专业。我热衷于社会影响、系统思维、无障碍设计和终身学习。',
            },
        },

        // Settings Modal
        settings: {
            title: '设置',
            language: '语言',
            languageDesc: '选择显示语言',
            mode3d: '3D 模式',
            close: '关闭',
        },

        // Boot Screen
        boot: {
            initializing: '正在初始化神经接口',
            connecting: '正在连接皮层',
            loading: '正在加载人格矩阵',
            ready: '系统就绪',
        },

        // Biometric Monitor
        biometric: {
            sysMon: '系统监控',
            cortex: '皮层负荷',
            sync: '神经同步',
            stable: '稳定',
            vitals: '生命体征',
            normal: '正常',
            stress: '精神压力',
            overload: '神经过载',
            illness: '生理异常',
            energy: '能量水平',
        },
    },
} as const;

export type Language = 'en' | 'zh';
export type TranslationKeys = typeof translations.en;
