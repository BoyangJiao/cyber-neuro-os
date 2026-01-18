import { CyberButton } from '../ui/CyberButton';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n';

export const Footer = () => {
    const { setSettingsOpen } = useAppStore();
    const { t } = useTranslation();

    return (
        <div className="w-full h-full flex items-center justify-between pt-2 2xl:pt-3">
            {/* Footer Left: Neural Uplink */}
            <div className="flex items-center gap-4 2xl:gap-5">
                <CyberButton
                    variant="dot"
                    size="sm"
                    showGhost={true}
                    ghostOffset="translate-x-[-4px] translate-y-[2px]"
                    className="min-w-[120px] lg:min-w-[160px] 2xl:min-w-[180px]"
                >
                    <span className="text-xs lg:text-sm 2xl:text-base">{t('footer.neuralUplink')}</span>
                    <i className="ri-chat-ai-4-line text-base lg:text-lg 2xl:text-xl"></i>
                </CyberButton>
            </div>

            {/* Footer Right: Settings & Equalizer */}
            <div className="flex items-center gap-4 lg:gap-6 2xl:gap-7">
                <CyberButton
                    variant="dot"
                    size="sm"
                    showGhost={true}
                    ghostOffset="-translate-x-[-4px] -translate-y-[-2px]"
                    className="border-none group px-3 lg:px-4 2xl:px-5"
                    onClick={() => setSettingsOpen(true)}
                >
                    <span className="mr-1 lg:mr-2 text-xs lg:text-sm 2xl:text-base transition-colors">{t('footer.settings')}</span>
                    <i className="ri-settings-line animate-spin-slow text-base lg:text-lg 2xl:text-xl"></i>
                </CyberButton>
                <div className="w-[1px] h-5 lg:h-6 2xl:h-7 bg-border-default"></div>
                <CyberButton variant="dot" size="sm" iconOnly showGhost={true} ghostOffset="-translate-x-[-4px] -translate-y-[-2px]" className="flex items-center justify-center">
                    <i className="ri-voiceprint-line text-base lg:text-lg 2xl:text-xl"></i>
                </CyberButton>
            </div>
        </div>
    );
};
