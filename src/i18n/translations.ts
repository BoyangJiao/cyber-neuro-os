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
            project: 'CORE',
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
                label: '// DESIGN PHILOSOPHY',
                subtitle: 'System Thinker at Core',
                content: 'Dedicated to finding the optimal solution at the intersection of complex business needs, cutting-edge technology, and human behavior. While meticulously crafting every "Aha moment," I maintain a sharp sensitivity to the overarching business context and underlying logic. I excel at weaving scattered touchpoints into highly structured and intuitive digital products. Currently, I am deeply exploring Design as code, the evolution of AI Agentic Design Ops, and crafting ultimate experiences across multi-platform ecosystems.',
            },
            careerAndDesign: {
                label: '// CAREER EXPERIENCE',
                subtitle: 'Designing Across Boundaries',
                content: 'Spearheaded the product and system design for consumer-facing digital wallets and B2B cross-border payment platforms at Ant Group. Prior to this, my design practice spanned mobile apps, web platforms, offline services, and voice user interfaces (VUI). Across industries ranging from new retail and social media to education, gaming, and automotive, this cross-disciplinary journey has honed my ability to identify experiential commonalities across diverse business models and apply a holistic perspective to solve complex pain points.',
            },
            educationAndPassions: {
                label: '// FOUNDATION',
                subtitle: 'Where Psychology Meets HCI',
                content: 'Holding an MDes in Interaction Design from California College of the Arts (CCA) and a BA in Cognitive Psychology from the University of Missouri (Mizzou), my thinking is firmly rooted in human cognition and behavioral science. In the ever-changing tide of technology, I maintain an intense curiosity and hands-on capability for cutting-edge technologies and tools. Regardless of how mediums evolve—from solving present problems to creating future possibilities—I remain committed to using deep user empathy to guide technology, building trust and synergy between humans and machines.'
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
            deepDiveMode: 'DEEPDIVE MODE',
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
            dragToCompare: 'Drag to compare',
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
            deploy: 'LAUNCH',
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
                aiReadyGuide: {
                    title: 'AI READY DESIGN SYSTEM',
                    desc: 'A comprehensive guide and protocol for constructing scalable, AI-compatible design frameworks. Ensures seamless integration between cognitive AI agents and human-centric interfaces.'
                },
                comingSoon: {
                    title: 'PROJECT CLASSIFIED',
                    desc: '/// UPLINK SEVERED /// Further experimental modules are currently under construction. Please await further system clearance.'
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
            project: '核心',
            video: '幻想',
            game: '模拟',
            sound: '合成器',
            music: '电台',
            lab: '实验仓',
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
                label: '// 设计哲学',
                subtitle: '以系统思考为内核',
                content: '致力于在复杂的商业诉求、前沿技术与人类行为之间寻找最优解。在精心打磨每一个 Aha moment 的同时，我始终对全局的业务脉络与底层逻辑保持敏锐，将散落的触点编织成极具秩序感与直觉性的数字产品。目前，我正深度探索 Design as code、AI Agentic Design Ops 演进，以及多端场景下的极致体验。',
            },
            careerAndDesign: {
                label: '// 经验坐标',
                subtitle: '跨越边界的体验构建',
                content: '曾在蚂蚁集团主导 C 端数字钱包与 B 端跨境收付款平台的产品与系统设计。在此之前，我的设计实践广泛触达移动应用、Web 端、线下服务及语音交互（VUI）。从新零售、社交媒体，到教育、游戏与汽车行业，跨领域的历练让我能更敏锐地捕捉不同商业形态下的体验共性，并用跨界视角解决复杂痛点。',
            },
            educationAndPassions: {
                label: '// 底层驱动',
                subtitle: '当心理学遇上人机交互',
                content: '加州艺术学院 (CCA) 人机交互硕士，密苏里大学 (Mizzou) 认知心理学学士，以人类认知与行为学为思考基石。在日新月异的技术浪潮中，我始终保持对前沿技术与工具的强烈好奇与实践力。无论媒介如何演进——从解决当下的问题，到创造未来的可能——我都坚持以深刻的用户同理心去牵引技术，构建人机之间的信任与默契。'
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
            deepDiveMode: '深潜模式',
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
            dragToCompare: '左右滑动查看差异',
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
            deploy: '启动',
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
                aiReadyGuide: {
                    title: 'AI 友好设计系统指南',
                    desc: '构建可扩展、人工智能兼容设计框架的综合指南和协议。确保认知型 AI 代理与以人为本的界面之间实现无缝集成。'
                },
                comingSoon: {
                    title: '机密项目研制中',
                    desc: '/// 遥测链路已断开 /// 更多实验性神经模块正在构建中，请等待进一步的系统授权权限。敬请期待。'
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
