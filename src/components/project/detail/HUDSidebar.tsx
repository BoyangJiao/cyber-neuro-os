import { motion } from 'framer-motion';
import type { ProjectDetail } from '../../../data/projectDetails';

interface HUDSidebarProps {
    detail: ProjectDetail;
    activeSection: string;
    sections: { id: string; title: string }[];
    onNavigate: (sectionId: string) => void;
}

export const HUDSidebar = ({ detail, activeSection, sections, onNavigate }: HUDSidebarProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionDiv = motion.div as React.ComponentType<any>;

    const { sidebar } = detail;

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
                    {sidebar.techStack.map((tech, index) => (
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
                    {sidebar.coreContributions.map((contribution, index) => (
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

            {/* Section Navigation - Collapsible */}
            <div className="relative px-4 py-4 border-t border-cyan-900/30 group/nav">
                <div className="text-[12px] font-mono text-cyan-700 tracking-widest uppercase mb-3">
                    Sections
                </div>
                <nav className="relative">
                    {/* Active Section Display (always visible) */}
                    {sections.map((section) => {
                        const isActive = activeSection === section.id;
                        if (!isActive) return null;

                        return (
                            <div
                                key={`active-${section.id}`}
                                className="flex items-center gap-3 py-2 px-2 group-hover/nav:hidden cursor-pointer"
                                style={{
                                    background: 'rgba(0, 240, 255, 0.1)',
                                    borderLeft: '2px solid rgba(0, 240, 255, 0.8)',
                                }}
                            >
                                <div
                                    className="w-1.5 h-1.5"
                                    style={{
                                        background: '#00f0ff',
                                        boxShadow: '0 0 8px rgba(0, 240, 255, 0.8)',
                                    }}
                                />
                                <span
                                    className="text-[12px] font-mono tracking-wider"
                                    style={{ color: '#00f0ff' }}
                                >
                                    {section.title}
                                </span>
                                <i className="ri-arrow-down-s-line text-cyan-600 ml-auto text-sm" />
                            </div>
                        );
                    })}

                    {/* Expanded List (visible on hover) */}
                    <div className="hidden group-hover/nav:block space-y-1">
                        {sections.map((section, index) => {
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => onNavigate(section.id)}
                                    className="w-full text-left"
                                >
                                    <MotionDiv
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.03 * index }}
                                        className="flex items-center gap-3 py-2 px-2 transition-all duration-200 hover:bg-cyan-900/20"
                                        style={{
                                            background: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                                            borderLeft: isActive ? '2px solid rgba(0, 240, 255, 0.8)' : '2px solid transparent',
                                        }}
                                    >
                                        <div
                                            className="w-1.5 h-1.5 transition-all duration-300"
                                            style={{
                                                background: isActive ? '#00f0ff' : 'rgba(0, 240, 255, 0.3)',
                                                boxShadow: isActive ? '0 0 8px rgba(0, 240, 255, 0.8)' : 'none',
                                            }}
                                        />
                                        <span
                                            className="text-[12px] font-mono tracking-wider transition-colors duration-200"
                                            style={{
                                                color: isActive ? '#00f0ff' : 'rgba(148, 163, 184, 0.7)',
                                            }}
                                        >
                                            {section.title}
                                        </span>
                                    </MotionDiv>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </div>
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
