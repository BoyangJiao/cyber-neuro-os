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
                about: 'ABOUT SYSTEM',
                settings: 'SETTINGS',
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
            cortex: 'CORTEX',
            sync: 'SYNC',
            stable: 'STABLE',
            vitals: 'VITALS',
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
                pokemonEmerald: {
                    title: 'POKÉMON EMERALD',
                    desc: 'GAME BOY ADVANCE, 2004'
                },
                zeldaMinish: {
                    title: 'ZELDA: MINISH CAP',
                    desc: 'GAME BOY ADVANCE, 2004'
                },
                kirbyMirror: {
                    title: 'KIRBY AMAZING MIRROR',
                    desc: 'GAME BOY ADVANCE, 2004'
                },
                marioAdvance: {
                    title: 'SUPER MARIO ADV 4',
                    desc: 'GAME BOY ADVANCE, 2003'
                },
                metroidFusion: {
                    title: 'METROID FUSION',
                    desc: 'GAME BOY ADVANCE, 2002'
                },
                castlevaniaAria: {
                    title: 'ARIAS OF SORROW',
                    desc: 'GAME BOY ADVANCE, 2003'
                }
            }
        },

        // Synthesis Landing (Soundboard)
        synthesis: {
            title: 'SOUNDBOARD',
            sidebar: 'AN INTERACTIVE INDEX OF SYSTEM AUDITORY FEEDBACK AND SYNTHESIZED SOUNDSCAPES USED WITHIN THE NEURAL OS ENVIRONMENT.',
            sounds: {
                sysBoot: 'SYS BOOT UP',
                accessGranted: 'ACCESS GRTD',
                accessDenied: 'ACCESS DNYD',
                dataTransfer: 'DATA FLOW',
                glitchHeavy: 'FATAL GLITCH',
                scanComplete: 'SCAN DONE',
                notification: 'NEW MESSAGE',
                warningAlarm: 'CORE ALARM'
            }
        },

        // Lab Landing (Experimental Apps)
        lab: {
            title: 'LABORATORY',
            launchApp: 'LAUNCH SYS',
            apps: {
                colorDecoder: {
                    title: 'COLOR DECODER',
                    desc: 'A utility for extracting and decoding Hex, RGB, and HSL color values from various input spaces. Designed for rapid palette prototyping and accessibility contrast checking within the Neural framework.'
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
                about: '关于系统',
                settings: '系统设置',
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
            cortex: '皮层负荷',
            sync: '神经同步',
            stable: '稳定',
            vitals: '生命体征',
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
                pokemonEmerald: {
                    title: '宝可梦 绿宝石',
                    desc: 'GAME BOY ADVANCE, 2004'
                },
                zeldaMinish: {
                    title: '塞尔达传说：神奇的帽子',
                    desc: 'GAME BOY ADVANCE, 2004'
                },
                kirbyMirror: {
                    title: '星之卡比：镜之大迷宫',
                    desc: 'GAME BOY ADVANCE, 2004'
                },
                marioAdvance: {
                    title: '超级马里奥 Advance 4',
                    desc: 'GAME BOY ADVANCE, 2003'
                },
                metroidFusion: {
                    title: '银河战士 融合',
                    desc: 'GAME BOY ADVANCE, 2002'
                },
                castlevaniaAria: {
                    title: '恶魔城 晓月圆舞曲',
                    desc: 'GAME BOY ADVANCE, 2003'
                }
            }
        },

        // Synthesis Landing (Soundboard)
        synthesis: {
            title: '效果声库',
            sidebar: '赛博原生操作系统环境内部使用的所有系统级听觉反馈、通知音效和合成声音文件的交互式可视化索引板。',
            sounds: {
                sysBoot: '系统启动音',
                accessGranted: '授权通过',
                accessDenied: '授权拒绝',
                dataTransfer: '数据流传输',
                glitchHeavy: '严重故障音',
                scanComplete: '扫描完成',
                notification: '收到新消息',
                warningAlarm: '核心警报音'
            }
        },

        // Lab Landing (Experimental Apps)
        lab: {
            title: '实验工坊',
            launchApp: '启动终端',
            apps: {
                colorDecoder: {
                    title: '色彩解码器',
                    desc: '一个用于从各种输入空间提取和解码 Hex、RGB 和 HSL 颜色值的实用程序。专为 Neural 框架内的快速调色板原型设计和可访问性对比度检查而设计。'
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
    },
} as const;

export type Language = 'en' | 'zh';
export type TranslationKeys = typeof translations.en;
