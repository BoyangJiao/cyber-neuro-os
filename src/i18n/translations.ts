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
            system: 'SYSTEM',
            legal: {
                title: 'BO.J DESIGN © 2026 // NEURO TERMINAL',
                p1: 'All biometric and cognitive data processed through the neuro.OS terminal remains strictly localized.',
                p2: 'COMPLIANCE RE: Directive M-1022-242. SYNCHRONIZATION LOGS are secured under the 2032 Cybernetic Operations Act and Federal Neural Records protocols.',
            }
        },

        // Feature Panel
        features: {
            project: 'WORK',
            video: 'VISION',
            game: 'SIMULATION',
            sound: 'SYNTHESIS',
            music: 'BROADCAST',
            lab: 'LAB',
        },

        // Music Page
        music: {
            nowPlaying: 'NOW PLAYING',
            noDisc: 'NO DISC INSERTED',
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
                label: 'EDUCATION & PASSIONS',
                content: 'I hold a Master\'s degree in Human-Computer Interaction from California College of the Arts (CCA) and a Bachelor\'s degree in Psychology from the University of Missouri (Mizzou). I\'m passionate about the intersection of design, technology, and human behavior. Whether it\'s exploring new tools, developing design systems, or understanding user complexities, I am constantly learning and adapting in this ever-evolving digital landscape.'
            },
            stats: {
                productDesign: { name: 'PRODUCT DESIGN', desc: 'End-to-end design strategy & execution' },
                leadership: { name: 'LEADERSHIP', desc: 'Cross-functional team management' },
                designSystems: { name: 'DESIGN SYSTEMS', desc: 'Scalable component architecture' },
                engineering: { name: 'ENGINEERING', desc: 'Frontend & Creative Coding' },
                research: { name: 'RESEARCH', desc: 'Data-driven user insights' },
                strategicThinking: { name: 'STRATEGIC THINKING', desc: 'Business acumen & product strategy' }
            }
        },

        // Layout
        layout: {
            sysReady: 'SYS_READY',
            neuralCoreActive: 'NEURAL_CORE_ACTIVE',
        },

        // Systems Modal
        settings: {
            title: 'SYSTEMS',
            tabs: {
                about: 'ABOUT',
                appearance: 'APPEARANCE',
                audio: 'AUDIO',
            },
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
            cortexLoad: 'CORTEX_LOAD',
            syncRatio: 'SYNC_RATIO',
            cogLoad: 'COGNITIVE_LOAD',
            archiveCap: 'ARCHIVE_CAP',
            coreTemp: 'CORE_TEMP',
            vitals: 'VITALS',
            uplink: 'UPLINK',
            aligning: 'ALIGNING...',
            cortex: 'CORTEX',
            sync: 'SYNC',
            stable: 'STABLE',
            normal: 'NORMAL',
            stress: 'STRESS',
            overload: 'OVERLOAD',
            illness: 'ILLNESS',
            energy: 'ENERGY',
            deepRest: 'DEEP_REST',
            bootSeq: 'BOOT_SEQ',
            peakFocus: 'PEAK_FOCUS',
            recharge: 'RECHARGE',
            active: 'ACTIVE',
            windDown: 'WIND_DOWN',
            jitter: '△ JITTER',
        },

        // Mobile Gate
        mobile: {
            title: 'DESKTOP VIEWPORT REQUIRED',
            description: 'NeuralOS is architected for wide-screen interfaces. The current viewport cannot render the neural dashboard correctly.',
            instruction: 'Please switch to a desktop browser or increase your window width to continue.',
            dismiss: 'FORCE ENTRY',
        },

        // Project Detail
        projectDetail: {
            loading: 'LOADING NEURAL LINK...',
            notFound: 'PROJECT NOT FOUND',
            unavailable: 'The requested project data is unavailable.',
            returnToDir: 'Return to Directory',
            endOfCase: 'End of Case Study',
            backToDir: 'Back to Directory',
            sidebar: {
                myRole: 'My Role',
                team: 'Team',
                timelineStatus: 'Timeline & Status',
                projectType: 'Project Type',
                coreContributions: 'Core Contributions',
            }
        },

        // Project Landing (Mission Interface)
        projectLanding: {
            title: 'WORK',
            project: 'PROJECT',
            initializing: 'INITIALIZING CORE...',
            caseStudy: 'Case Study',
            snapshot: 'Snapshot',
            noMission: '[ NO MISSION SELECTED ]',
            deploy: 'DEPLOY',
            loadingFeed: 'LOADING FEED...',
        },

        // Simulation Landing (Mini Games)
        simulation: {
            title: 'MINI GAMES',
            sidebar: 'HERE YOU WILL SEE A FEW MINI GAMES I IMPLEMENTED IN REACT OR IN CANVAS.\n\nHAVE FUN!',
            games: {
                doomGba: {
                    title: 'DOOM GBA',
                    desc: 'ID SOFTWARE / DAVID A. PALMER PROD, 2001'
                },
                pacmanGba: {
                    title: 'PAC-MAN (GAPMAN)',
                    desc: 'GBA HOMEBREW CLONE'
                },
                goldenSun: {
                    title: 'GOLDEN SUN',
                    desc: 'CAMELOT / NINTENDO, 2001'
                },
                fireEmblem: {
                    title: 'FIRE EMBLEM: THE BINDING BLADE',
                    desc: 'INTELLIGENT SYSTEMS / NINTENDO, 2002'
                },
                warioLandVb: {
                    title: 'VIRTUAL BOY WARIO LAND',
                    desc: 'NINTENDO R&D1, 1995'
                }
            }
        },

        // Synthesis Landing (Soundboard)
        synthesis: {
            title: 'SOUNDBOARD',
            sounds: {
                accessGranted: 'ACCESS GRTD',
                accessDenied: 'ACCESS DNYD',
                systemGlitch: 'SYS GLITCH',
                uiHover: 'SYS BEEP',
                ambientDream: 'AMBIENT DRM'
            }
        },

        // Lab Landing (Experimental Apps)
        lab: {
            title: 'LABORATORY',
            launchApp: 'LAUNCH',
            apps: {
                avatarGenerator: {
                    title: 'AVATAR GENERATOR',
                    desc: 'A robust utility for generating and customizing unique pixel-art avatars. Equip your digital persona with procedurally generated visual identities optimized for the Neural framework.'
                },
                hashGen: {
                    title: 'HASH GENERATOR',
                    desc: 'Cryptographic hashing tool utilizing MD5, SHA-1, and SHA-256 algorithms. Essential for verifying data integrity and encrypting sensitive user payloads prior to cortex transmission.'
                },
                base64Term: {
                    title: 'BASE64 TERMINAL',
                    desc: 'A terminal interface dedicated entirely to bidirectional Base64 encoding and decoding. Provides a raw text output stream suitable for embedding binary data into text files seamlessly.'
                }
            }
        },

        // Intercept Modal
        intercept: {
            warning: 'WARNING',
            message: 'Insufficient biological clearance. Access to {{moduleName}} neural zone denied.',
            exit: 'EXIT',
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
            system: '系统',
            legal: {
                title: 'BO.J DESIGN © 2026 // 神经终端',
                p1: '通过 neuro.OS 终端处理的所有生物识别和认知数据均保持严格本地化。',
                p2: '合规参考：指令 M-1022-242。同步日志受 2032 年网络操作法案和联邦神经记录协议保护。',
            }
        },

        // Feature Panel
        features: {
            project: '作品',
            video: '视频',
            game: '游戏',
            sound: '声音',
            music: '音乐',
            lab: '实验室',
        },

        // Music Page
        music: {
            nowPlaying: '正在播放',
            noDisc: '未发现音频来源',
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
                label: '教育背景与热情',
                content: '我拥有加州艺术学院 (CCA) 的人机交互硕士学位，以及密苏里大学 (Mizzou) 的心理学学士学位。我热衷于探索设计、技术和人类行为的交汇点。无论是尝试新工具、开发设计系统，还是深入理解用户复杂性，我都在这个不断演变的数字时代中持续学习和适应。'
            },
            stats: {
                productDesign: { name: '产品设计', desc: '端到端的产品体验与设计架构' },
                leadership: { name: '团队领导', desc: '跨部门协作与设计团队赋能' },
                designSystems: { name: '设计系统', desc: '可扩展的组件规范体系' },
                engineering: { name: '工程研发', desc: '前端开发与 AI 技术集成' },
                research: { name: '用户研究', desc: '数据驱动的用研方法论' },
                strategicThinking: { name: '战略思维', desc: '商业洞察与产品长期规划' }
            }
        },

        // Layout
        layout: {
            sysReady: '系统已就绪',
            neuralCoreActive: '神经核心活跃',
        },

        // Systems Modal
        settings: {
            title: '系统',
            tabs: {
                about: '关于',
                appearance: '外观',
                audio: '音频',
            },
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
            cortexLoad: '皮层负载',
            syncRatio: '神经同步',
            cogLoad: '认知负荷',
            archiveCap: '档案容量',
            coreTemp: '核心体温',
            vitals: '生命体征',
            uplink: '遥测链路',
            aligning: '重新同步中...',
            cortex: '皮层负荷',
            sync: '神经同步',
            stable: '稳定',
            normal: '正常',
            stress: '精神压力',
            overload: '神经过载',
            illness: '生理异常',
            energy: '能量水平',
            deepRest: '深度休眠',
            bootSeq: '系统启动',
            peakFocus: '深度专注',
            recharge: '能量补给',
            active: '活跃状态',
            windDown: '系统降温',
            jitter: '△ 波动异常',
        },

        // Mobile Gate
        mobile: {
            title: '需要桌面端视口',
            description: 'NeuralOS 为宽屏界面设计，当前视口无法正确渲染神经仪表盘。',
            instruction: '请切换到桌面浏览器，或增大窗口宽度以继续使用。',
            dismiss: '强制进入',
        },

        // Project Detail
        projectDetail: {
            loading: '正在加载神经链接...',
            notFound: '未找到项目',
            unavailable: '请求的项目数据不可用。',
            returnToDir: '返回项目目录',
            endOfCase: '案例分析结束',
            backToDir: '返回目录',
            sidebar: {
                myRole: '我的角色',
                team: '团队',
                timelineStatus: '时间线与状态',
                projectType: '项目类型',
                coreContributions: '核心贡献',
            }
        },

        // Project Landing (Mission Interface)
        projectLanding: {
            title: '作品集',
            project: '项目',
            initializing: '正在初始化核心...',
            caseStudy: '案例分析',
            snapshot: '项目快照',
            noMission: '[ 未选择任何任务 ]',
            deploy: '部署并启动',
            loadingFeed: '获取画面流...',
        },

        // Simulation Landing (Mini Games)
        simulation: {
            title: '小型游戏',
            sidebar: '此模块内置了基于 WebAssembly 编译的 EmulatorJS。点击右侧的卡带插入并启动对应的 GBA 模拟序列。',
            games: {
                doomGba: {
                    title: '毁灭战士 GBA',
                    desc: 'ID SOFTWARE / DAVID A. PALMER PROD, 2001'
                },
                pacmanGba: {
                    title: '吃豆人 (GAPMAN)',
                    desc: 'GBA 自制版克隆'
                },
                goldenSun: {
                    title: '黄金太阳：开启的封印',
                    desc: 'CAMELOT / 任天堂, 2001'
                },
                fireEmblem: {
                    title: '火焰之纹章：封印之剑',
                    desc: 'INTELLIGENT SYSTEMS / 任天堂, 2002'
                },
                warioLandVb: {
                    title: 'VIRTUAL BOY 瓦力欧乐园',
                    desc: '任天堂 R&D1, 1995'
                }
            }
        },

        // Synthesis Landing (Soundboard)
        synthesis: {
            title: '效果声库',
            sounds: {
                accessGranted: '授权通过',
                accessDenied: '授权拒绝',
                systemGlitch: '系统故障',
                uiHover: '系统交互',
                ambientDream: '神经氛围音'
            }
        },

        // Lab Landing (Experimental Apps)
        lab: {
            title: '实验工坊',
            launchApp: '启动',
            apps: {
                avatarGenerator: {
                    title: '角色生成器',
                    desc: '一个用于生成和自定义像素风格头像的实用工具。为您配置专为 Neural 框架优化的程序化可视数字身份。'
                },
                hashGen: {
                    title: '哈希生成器',
                    desc: '利用 MD5、SHA-1 和 SHA-256 算法的加密哈希工具。对于在皮层传输之前验证数据完整性和加密敏感用户有效负载至关重要。'
                },
                base64Term: {
                    title: 'BASE64 终端',
                    desc: '一个完全专用于双向 Base64 编码和解码的终端接口。提供适合将二进制数据无缝嵌入文本文件的原始文本输出流。'
                }
            }
        },

        // Intercept Modal
        intercept: {
            warning: 'WARNING',
            message: '当前生物权限不足，无法访问 {{moduleName}} 神经元区域',
            exit: '退出',
        },
    },
} as const;

export type Language = 'en' | 'zh';
export type TranslationKeys = typeof translations.en;
