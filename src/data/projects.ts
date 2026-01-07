export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    status: string | 'DEPLOYED' | 'IN_DEVELOPMENT' | 'CLASSIFIED';
    thumbnail: string; // Placeholder for now
}

export const projects: Project[] = [
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
