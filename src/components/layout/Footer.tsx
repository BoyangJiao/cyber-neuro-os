import { CyberButton } from '../ui/CyberButton';

export const Footer = () => {
    return (
        <div className="w-full h-full flex items-center justify-between pt-2">
            {/* Footer Left: Neural Uplink */}
            <div className="flex items-center gap-4">
                <CyberButton variant="dot" size="md" className="min-w-[160px] flex items-center gap-3">
                    <span>NEURAL UPLINK</span>
                    <i className="ri-chat-ai-4-line text-2xl"></i>
                </CyberButton>
            </div>

            {/* Footer Right: Settings & Equalizer */}
            <div className="flex items-center gap-6">
                <CyberButton variant="dot" size="md" className="text-cyan-400 hover:text-cyan-200 border-none group px-4">
                    <span className="mr-2 group-hover:text-cyan-100 transition-colors">VISUAL SETTINGS</span>
                    <i className="ri-settings-line animate-spin-slow text-cyan-500 group-hover:text-cyan-300 text-2xl"></i>
                </CyberButton>
                <div className="w-[1px] h-6 bg-cyan-800/50"></div>
                <CyberButton variant="dot" size="md" iconOnly className="flex items-center justify-center text-cyan-500 hover:text-cyan-300">
                    <i className="ri-voiceprint-line text-2xl"></i>
                </CyberButton>
            </div>
        </div>
    );
};
