import type { ProjectDetail, SanityProjectDetail } from '../../../data/projectDetails';

interface HUDSidebarProps {
    detail: ProjectDetail | SanityProjectDetail;
    activeSection: string;
    sections: { id: string; title: string }[];
    onNavigate: (sectionId: string) => void;
}

export const HUDSidebar = ({ detail }: HUDSidebarProps) => {

    const { sidebar } = detail;

    // Guard clause: if sidebar data is not available, don't render
    if (!sidebar) {
        return null;
    }

    return (
        <aside
            className="w-full h-fit"
            style={{
                // Glass morphism HUD panel
                background: 'rgba(6, 18, 26, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 240, 255, 0.15)',
                boxShadow: `
                    0 0 30px rgba(0, 240, 255, 0.1),
                    inset 0 0 30px rgba(0, 240, 255, 0.03)
                `,
            }}
        >
            {/* Scan Line Overlay */}
            <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 240, 255, 0.02) 3px, rgba(0, 240, 255, 0.02) 6px)',
                }}
            />

            {/* My Role */}
            <SidebarSection label="My Role">
                <span className="text-sm text-cyan-400 font-semibold">
                    {sidebar.role}
                </span>
            </SidebarSection>

            {/* Team */}
            <SidebarSection label="Team">
                <span className="text-sm text-neutral-300">
                    {sidebar.team}
                </span>
            </SidebarSection>

            {/* Timeline & Status */}
            <SidebarSection label="Timeline & Status">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-300">
                        {sidebar.timeline}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span
                        className="text-sm font-medium"
                        style={{
                            color: sidebar.status === 'Live' ? '#22c55e' :
                                sidebar.status === 'In Development' ? '#fbbf24' : '#94a3b8',
                        }}
                    >
                        {sidebar.status}
                    </span>
                    {sidebar.liveLink && (
                        <a
                            href={sidebar.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-500 hover:text-cyan-400 transition-colors"
                        >
                            <i className="ri-external-link-line text-sm" />
                        </a>
                    )}
                </div>
            </SidebarSection>

            {/* Tech Stack */}
            <SidebarSection label="Tech Stack">
                <div className="flex flex-wrap gap-1.5">
                    {(sidebar.techStack || []).map((tech, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 text-[12px] font-mono text-cyan-400/80"
                            style={{
                                background: 'rgba(0, 240, 255, 0.05)',
                                border: '1px solid rgba(0, 240, 255, 0.15)',
                            }}
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </SidebarSection>

            {/* Core Contributions */}
            <SidebarSection label="Core Contributions">
                <ul className="space-y-1.5">
                    {(sidebar.coreContributions || []).map((contribution, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <div
                                className="w-1 h-1 mt-2 flex-shrink-0"
                                style={{
                                    background: '#00f0ff',
                                    boxShadow: '0 0 4px rgba(0, 240, 255, 0.6)',
                                }}
                            />
                            <span className="text-sm text-neutral-300">{contribution}</span>
                        </li>
                    ))}
                </ul>
            </SidebarSection>


        </aside>
    );
};

// Helper component for sidebar sections
const SidebarSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="relative px-4 py-3 border-b border-cyan-900/30">
        <div className="text-[12px] font-mono text-cyan-700 tracking-widest uppercase mb-2">
            {label}
        </div>
        {children}
    </div>
);
