
import fs from 'fs';
import path from 'path';

// --- INLINED DATA START ---
const projects = [
    {
        id: 'p1',
        title: 'NEURAL SYNC',
        description: 'Brain-Computer Interface data visualization dashboard.',
        techStack: ['React', 'Three.js', 'WebSockets'],
        status: 'DEPLOYED',
        thumbnail: 'ri-brain-line'
    },
    {
        id: 'p2',
        title: 'CYBER MARKET',
        description: 'Decentralized exchange for digital assets.',
        techStack: ['Solidity', 'Next.js', 'Ethers.js'],
        status: 'IN_DEVELOPMENT',
        thumbnail: 'ri-shopping-cart-line'
    },
    {
        id: 'p3',
        title: 'PROJECT TITAN',
        description: 'Top secret military simulation engine.',
        techStack: ['Unknown', 'C++'],
        status: 'CLASSIFIED',
        thumbnail: 'ri-shield-star-line'
    },
    {
        id: 'p4',
        title: 'NEURAL NET',
        description: 'AI-driven network traffic analysis tool.',
        techStack: ['Python', 'TensorFlow', 'D3.js'],
        status: 'DEPLOYED',
        thumbnail: 'ri-node-tree'
    },
    {
        id: 'p5',
        title: 'VOID WALKER',
        description: 'VR exploration game in procedural universe.',
        techStack: ['Unity', 'C#', 'HLSL'],
        status: 'IN_DEVELOPMENT',
        thumbnail: 'ri-gamepad-line'
    },
    {
        id: 'p6',
        title: 'DATA CORE',
        description: 'Secure vaulted storage for sensitive biosignals.',
        techStack: ['Rust', 'PostgreSQL', 'WASM'],
        status: 'DEPLOYED',
        thumbnail: 'ri-database-2-line'
    },
    {
        id: 'p7',
        title: 'GHOST SHELL',
        description: 'Cybersecurity penetration testing framework.',
        techStack: ['Kali', 'Bash', 'Go'],
        status: 'CLASSIFIED',
        thumbnail: 'ri-spy-line'
    },
    {
        id: 'p8',
        title: 'ECHO CHAMBER',
        description: 'Social sentiment analysis using NLP.',
        techStack: ['Node.js', 'OpenAI', 'Redis'],
        status: 'IN_DEVELOPMENT',
        thumbnail: 'ri-message-3-line'
    },
    {
        id: 'p9',
        title: 'SYNTH WAVE',
        description: 'Generative music platform powered by emotional state.',
        techStack: ['WebAudio API', 'Tone.js', 'Vue'],
        status: 'DEPLOYED',
        thumbnail: 'ri-pulse-line'
    }
];

const projectDetails: Record<string, any> = {
    'p1': {
        projectId: 'p1',
        tagline: 'Bridging the gap between neural signals and visual understanding',
        heroImage: '/images/neural-sync-hero.jpg',
        coreMetrics: [
            { label: 'Performance Gain', value: '340', unit: '%' },
            { label: 'Data Points/sec', value: '10K', unit: '+' },
            { label: 'Latency', value: '<50', unit: 'ms' },
        ],
        sidebar: {
            role: 'Lead Frontend Engineer',
            team: '1 PM, 2 Engineers, 1 Designer',
            timeline: '2024',
            status: 'Live',
            liveLink: 'https://neural-sync.example.com',
            techStack: ['React', 'Three.js', 'WebSockets', 'WebGL', 'D3.js'],
            coreContributions: [
                'System Architecture',
                '3D Visualization Engine',
                'Real-time Data Pipeline',
            ],
        },
        sections: {
            hook: {
                title: 'THE HOOK',
                content: 'What if you could visualize brain activity in real-time, transforming abstract neural signals into an intuitive, interactive experience?',
            },
            context: {
                title: 'CONTEXT',
                challenge: 'Existing BCI visualization tools were either too technical for general users or too simplified for researchers. We needed a solution that served both.',
                background: 'As brain-computer interfaces become more prevalent, the need for accessible visualization grows. NEURAL SYNC was born from the challenge of making complex biosignal data understandable without sacrificing depth.',
            },
            strategy: {
                title: 'STRATEGY & INSIGHT',
                insights: [
                    'Real-time data requires predictive rendering, not reactive updates',
                    'Color and motion convey meaning faster than numbers',
                    'Researchers need drill-down capability; users need overview clarity',
                ],
                approach: 'We implemented a layered visualization system with WebGL for raw performance, Three.js for 3D neural mapping, and a custom state machine for managing data flow hierarchies.',
            },
            highlights: {
                title: 'KEY HIGHLIGHTS',
                items: [
                    {
                        title: '3D Neural Topology',
                        description: 'Interactive brain model with real-time activity mapping across 128 electrode channels.',
                    },
                    {
                        title: 'Adaptive Zoom',
                        description: 'Semantic zooming that reveals more detail as users focus, from overview to individual neuron clusters.',
                    },
                    {
                        title: 'Time-Travel Debugging',
                        description: 'Researchers can scrub through recorded sessions to analyze specific neural events.',
                    },
                ],
            },
            outcome: {
                title: 'OUTCOME',
                results: [
                    'Deployed to 3 research labs with 50+ daily active users',
                    'Reduced analysis time from hours to minutes',
                    'Published findings in IEEE VIS 2024',
                ],
                reflection: 'This project reinforced my belief that the best interfaces disappear—they let users focus on understanding, not operating.',
            },
        },
    },
    'p2': {
        projectId: 'p2',
        tagline: 'Decentralized trading for the next generation of digital assets',
        heroImage: '/images/cyber-market-hero.jpg',
        coreMetrics: [
            { label: 'TVL Peak', value: '$2.4', unit: 'M' },
            { label: 'Transactions', value: '45K', unit: '+' },
            { label: 'Gas Saved', value: '60', unit: '%' },
        ],
        sidebar: {
            role: 'Staff Engineer',
            team: '1 PM, 3 Engineers, 1 Smart Contract Dev',
            timeline: '2023 - 2024',
            status: 'Live',
            liveLink: 'https://cyber-market.example.com',
            techStack: ['Solidity', 'Next.js', 'Ethers.js', 'The Graph', 'IPFS'],
            coreContributions: [
                'Smart Contract Architecture',
                'Trade Preview Engine',
                'Gas Optimization',
            ],
        },
        sections: {
            hook: {
                title: 'THE HOOK',
                content: 'In a world of centralized exchanges, could we build something trustless, fast, and actually usable?',
            },
            context: {
                title: 'CONTEXT',
                challenge: 'DEX interfaces are notoriously confusing. Gas fees are unpredictable. Users fear making irreversible mistakes.',
                background: 'CYBER MARKET aimed to bring CEX-level UX to decentralized trading while maintaining full transparency and user custody.',
            },
            strategy: {
                title: 'STRATEGY & INSIGHT',
                insights: [
                    'Confidence comes from clarity—show exactly what will happen before it happens',
                    'Batch transactions to reduce gas overhead',
                    'Progressive disclosure: simple by default, powerful on demand',
                ],
                approach: 'We built a gasless meta-transaction system with a preview engine that simulates trades before execution, giving users confidence and safety.',
            },
            highlights: {
                title: 'KEY HIGHLIGHTS',
                items: [
                    {
                        title: 'Trade Simulator',
                        description: 'Preview exact outcomes with slippage calculation before signing any transaction.',
                    },
                    {
                        title: 'Smart Routing',
                        description: 'Automatically splits orders across liquidity pools for best execution.',
                    },
                    {
                        title: 'Gasless Mode',
                        description: 'Users can trade without ETH in wallet—fees are deducted from trade output.',
                    },
                ],
            },
            outcome: {
                title: 'OUTCOME',
                results: [
                    'Beta launch with 2,000+ users in first month',
                    'Zero support tickets related to failed transactions',
                    'Featured in Ethereum Foundation newsletter',
                ],
                reflection: 'DeFi doesn\'t have to be scary. The right abstractions can make trustless systems feel trustworthy.',
            },
        },
    },
};
// --- INLINED DATA END ---

const generateNDJSON = () => {
    const documents: any[] = [];

    // Assuming we want to keep current working directory context
    const cwd = process.cwd();

    for (const proj of projects) {
        const detail = projectDetails[proj.id];
        const contentModules = [];

        if (detail) {
            // 1. Hook
            if (detail.sections?.hook) {
                contentModules.push({
                    _key: `hook-${proj.id}`,
                    _type: 'projectSection',
                    title: detail.sections.hook.title || 'The Highlight',
                    theme: 'highlights',
                    layout: 'full-width',
                    content: [
                        { _type: 'block', children: [{ _type: 'span', text: detail.sections.hook.content }] }
                    ]
                });
            }
            // 2. Context
            if (detail.sections?.context) {
                contentModules.push({
                    _key: `context-${proj.id}`,
                    _type: 'projectSection',
                    title: detail.sections.context.title || 'Context',
                    theme: 'context',
                    layout: 'left-sidebar',
                    content: [
                        { _type: 'block', style: 'h4', children: [{ _type: 'span', text: 'The Challenge' }] },
                        { _type: 'block', children: [{ _type: 'span', text: detail.sections.context.challenge }] },
                        { _type: 'block', style: 'h4', children: [{ _type: 'span', text: 'Background' }] },
                        { _type: 'block', children: [{ _type: 'span', text: detail.sections.context.background }] }
                    ]
                });
            }
            // 3. Strategy
            if (detail.sections?.strategy) {
                contentModules.push({
                    _key: `strategy-${proj.id}`,
                    _type: 'projectSection',
                    title: detail.sections.strategy.title || 'Strategy',
                    theme: 'strategy',
                    layout: 'full-width',
                    content: [
                        { _type: 'block', style: 'h4', children: [{ _type: 'span', text: detail.sections.strategy.approach }] },
                        ...detail.sections.strategy.insights.map((insight: string) => ({
                            _type: 'block', style: 'normal', listItem: 'bullet', children: [{ _type: 'span', text: insight }]
                        }))
                    ]
                });
            }
            // 4. Outcomes
            if (detail.sections?.outcome) {
                contentModules.push({
                    _key: `outcome-${proj.id}`,
                    _type: 'projectSection',
                    title: detail.sections.outcome.title || 'Outcome',
                    theme: 'outcome',
                    layout: 'full-width',
                    content: [
                        { _type: 'block', children: [{ _type: 'span', text: detail.sections.outcome.reflection }] },
                        ...detail.sections.outcome.results.map((res: string) => ({
                            _type: 'block', style: 'normal', listItem: 'bullet', children: [{ _type: 'span', text: res }]
                        }))
                    ]
                });
            }
        }

        const doc = {
            _id: `project-${proj.id}`,
            _type: 'project',
            title: proj.title,
            slug: { _type: 'slug', current: proj.id },
            description: proj.description,
            projectType: (proj.techStack && proj.techStack[0]) || 'Web3',
            sidebar: detail ? {
                role: detail.sidebar.role,
                team: detail.sidebar.team,
                timeline: detail.sidebar.timeline,
                status: detail.sidebar.status,
                liveLink: detail.sidebar.liveLink,
                techStack: detail.sidebar.techStack,
                coreContributions: detail.sidebar.coreContributions
            } : { status: 'In Development' },
            contentModules: contentModules
        };

        // Add Metrics if available
        if (detail && detail.coreMetrics) {
            (doc as any).coreMetrics = detail.coreMetrics.map((m: any) => ({
                _key: m.label,
                label: m.label,
                value: m.value,
                unit: m.unit
            }));
        }

        documents.push(doc);
    }

    // Write NDJSON
    const outputPath = path.resolve(cwd, 'scripts/migration.ndjson');
    const fileStream = fs.createWriteStream(outputPath);

    documents.forEach(doc => {
        fileStream.write(JSON.stringify(doc) + '\n');
    });

    fileStream.end();
    console.log(`NDJSON generated: ${outputPath}`);
};

generateNDJSON();
