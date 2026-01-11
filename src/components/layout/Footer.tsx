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
                <CyberButton variant="dot" size="sm" className="min-w-[120px] lg:min-w-[160px] 2xl:min-w-[180px] flex items-center gap-2 lg:gap-3">
                    <span className="text-xs lg:text-sm 2xl:text-base">{t('footer.neuralUplink')}</span>
                    <i className="ri-chat-ai-4-line text-base lg:text-lg 2xl:text-xl"></i>
                </CyberButton>
            </div>

            {/* Footer Right: Settings & Equalizer */}
            <div className="flex items-center gap-4 lg:gap-6 2xl:gap-7">
                <CyberButton
                    variant="dot"
                    size="sm"
                    className="text-cyan-400 hover:text-cyan-200 border-none group px-3 lg:px-4 2xl:px-5"
                    onClick={() => setSettingsOpen(true)}
                >
                    <span className="mr-1 lg:mr-2 text-xs lg:text-sm 2xl:text-base group-hover:text-cyan-100 transition-colors">{t('footer.settings')}</span>
                    <i className="ri-settings-line animate-spin-slow text-cyan-500 group-hover:text-cyan-300 text-base lg:text-lg 2xl:text-xl"></i>
                </CyberButton>
                <div className="w-[1px] h-5 lg:h-6 2xl:h-7 bg-cyan-800/50"></div>
                <CyberButton variant="dot" size="sm" iconOnly className="flex items-center justify-center text-cyan-500 hover:text-cyan-300">
                    <i className="ri-voiceprint-line text-base lg:text-lg 2xl:text-xl"></i>
                </CyberButton>
            </div>
        </div>
    );
};
