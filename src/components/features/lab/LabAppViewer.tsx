import type { LabApp } from '../../../data/lab';
import { useTranslation } from '../../../i18n';
import { CyberButton } from '../../ui/CyberButton';
import { HoloFeatureCard } from '../../ui/HoloFeatureCard';

interface LabAppViewerProps {
    app: LabApp;
}

export const LabAppViewer = ({ app }: LabAppViewerProps) => {
    const { t } = useTranslation();

    const handleLaunch = () => {
        if (app.iframeUrl) {
            window.open(app.iframeUrl, '_blank', 'noopener,noreferrer');
        } else {
            // No external URL — component-based apps would be handled inline
        }
    };

    return (
        <div className="w-full h-full flex flex-row items-stretch gap-6 lg:gap-10 xl:gap-14">
            {/* Left Side: Visual Card (3D Card Mode) — shrinks aggressively on narrow viewports */}
            <div className="shrink w-[200px] lg:w-[260px] xl:w-[320px] min-w-[160px] aspect-[3/4] relative z-20 self-center">
                <HoloFeatureCard
                    title={""}
                    icon={app.image}
                    geometryType={app.geometryType || "lab"}
                />
            </div>

            {/* Right Side: Information Panel — takes priority for content readability */}
            <div className="flex-1 min-w-[280px] flex flex-col justify-center relative py-2 overflow-hidden">
                <div className="flex flex-col gap-3 lg:gap-4">
                    {/* Status Line */}
                    <span className="text-[10px] md:text-xs font-mono tracking-widest text-text-secondary uppercase">
                        STATUS: {app.status}
                    </span>

                    {/* Title */}
                    <h2 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-display tracking-[0.1em] text-brand-primary uppercase leading-tight font-bold">
                        {t(app.titleKey)}
                    </h2>

                    {/* Description */}
                    <p className="text-xs lg:text-sm font-mono tracking-wider text-status-error leading-relaxed opacity-90 text-left line-clamp-5">
                        {t(app.descKey)}
                    </p>
                </div>

                {/* Launch Button */}
                <div className="mt-4 lg:mt-6 flex justify-start">
                    <CyberButton
                        variant="chamfer"
                        onClick={handleLaunch}
                        icon={<i className="ri-external-link-line" />}
                        className="w-full sm:w-auto min-w-[160px] text-sm py-2.5 border-brand-primary/50 text-brand-primary hover:bg-brand-primary hover:text-black transition-all"
                        disabled={app.status !== 'ACTIVE'}
                    >
                        {app.status === 'ACTIVE' ? t('lab.launchApp') : 'SYSTEM OFFLINE'}
                    </CyberButton>
                </div>

                {/* System Specs Footer */}
                <div className="mt-6 lg:mt-10 flex flex-col gap-1 opacity-40">
                    <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
                        APP_ID: {app.id.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
                        SYS.VER: {app.componentType.substring(0, 3).toUpperCase()}_1.0.0
                    </span>
                </div>
            </div>
        </div>
    );
};
