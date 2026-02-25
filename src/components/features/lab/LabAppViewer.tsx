import type { LabApp } from '../../../data/lab';
import { useTranslation } from '../../../i18n';
import { CyberButton } from '../../ui/CyberButton';
import { HoloFeatureCard } from '../../ui/HoloFeatureCard';

interface LabAppViewerProps {
    app: LabApp;
}

export const LabAppViewer = ({ app }: LabAppViewerProps) => {
    const { t } = useTranslation();

    return (
        <div className="w-full flex flex-col md:flex-row gap-8 lg:gap-16 items-center md:items-start justify-center min-h-[60vh]">

            {/* Left Side: Visual Card (3D Card Mode) */}
            <div className="w-[280px] lg:w-[360px] shrink-0 aspect-[3/4] relative z-20">
                <HoloFeatureCard
                    title={""}
                    icon={app.image}
                    geometryType="lab"
                />
            </div>

            {/* Right Side: Information Panel */}
            <div className="flex-1 w-full md:max-w-xl flex flex-col justify-start relative min-w-[300px]">

                <div className="mb-6 pb-2">
                    <div className="flex flex-col gap-6">
                        {/* Title Header */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] md:text-xs font-mono tracking-widest text-text-secondary uppercase">
                                STATUS: {app.status}
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-display tracking-[0.1em] text-brand-primary uppercase leading-tight font-bold">
                                {t(app.titleKey)}
                            </h2>
                        </div>

                        {/* Description Text */}
                        <p className="text-sm lg:text-base font-mono tracking-wider text-status-error leading-relaxed opacity-90 text-left">
                            {t(app.descKey)}
                        </p>
                    </div>
                </div>

                <div className="mt-2 flex justify-start">
                    <CyberButton
                        variant="chamfer"
                        onClick={() => console.log(`Launch ${app.componentType}`)}
                        className="w-full sm:w-auto min-w-[200px] text-base py-3 border-brand-primary/50 text-brand-primary hover:bg-brand-primary hover:text-black transition-all"
                        disabled={app.status !== 'ACTIVE'}
                    >
                        {app.status === 'ACTIVE' ? t('lab.launchApp') : 'SYSTEM OFFLINE'}
                    </CyberButton>
                </div>

                {/* System Specs Footer */}
                <div className="mt-16 flex flex-col gap-2 opacity-50">
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
