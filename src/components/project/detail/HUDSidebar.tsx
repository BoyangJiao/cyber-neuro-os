import { ChamferFrame } from '../../ui/frames/ChamferFrame';
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
        <ChamferFrame
            className="w-full h-fit relative"
            bgClassName="bg-[#06121a]/60 backdrop-blur-xl"
            chamferSize={16}
            showEffects={false}
            disableHover={true}
        >


            {/* My Role */}
            <SidebarSection label="My Role">
                <span className="text-sm 2xl:text-base text-brand-primary font-semibold">
                    {sidebar.role}
                </span>
            </SidebarSection>

            {/* Team */}
            <SidebarSection label="Team">
                <span className="text-sm 2xl:text-base text-text-primary">
                    {sidebar.team}
                </span>
            </SidebarSection>

            {/* Timeline & Status */}
            <SidebarSection label="Timeline & Status">
                <div className="flex items-center gap-2">
                    <span className="text-sm 2xl:text-base text-text-primary">
                        {sidebar.timeline}
                    </span>
                    <span className="text-border-default">•</span>
                    <span
                        className="text-sm 2xl:text-base font-medium"
                        style={{
                            color: sidebar.status === 'Live' ? 'var(--color-status-success)' :
                                sidebar.status === 'In Development' ? 'var(--color-status-warning)' : 'var(--color-text-secondary)',
                        }}
                    >
                        {sidebar.status}
                    </span>
                    {sidebar.liveLink && (
                        <a
                            href={sidebar.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-primary hover:text-text-accent transition-colors"
                        >
                            <i className="ri-external-link-line text-sm 2xl:text-base" />
                        </a>
                    )}
                </div>
            </SidebarSection>

            {/* Tech Stack */}
            <SidebarSection label="Tech Stack">
                <div className="flex flex-wrap gap-1.5 2xl:gap-2">
                    {(sidebar.techStack || []).map((tech, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 text-[12px] 2xl:text-[14px] font-mono text-brand-primary/80 bg-brand-dim border border-brand-primary/15"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </SidebarSection>

            {/* Core Contributions */}
            <SidebarSection label="Core Contributions">
                <ul className="space-y-1.5 2xl:space-y-2">
                    {(sidebar.coreContributions || []).map((contribution, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <div
                                className="w-1 h-1 2xl:w-1.5 2xl:h-1.5 mt-2 flex-shrink-0 bg-brand-primary shadow-glow"
                            />
                            <span className="text-sm 2xl:text-base text-text-primary">{contribution}</span>
                        </li>
                    ))}
                </ul>
            </SidebarSection>


        </ChamferFrame>
    );
};

// Helper component for sidebar sections
const SidebarSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="relative px-4 2xl:px-5 py-3 2xl:py-4 border-b border-border-subtle">
        <div className="text-[12px] 2xl:text-[14px] font-mono text-brand-secondary tracking-widest uppercase mb-2 2xl:mb-3">
            {label}
        </div>
        {children}
    </div>
);
