import { useAppStore, type GlitchSettings } from '../../../store/useAppStore';
import { ToggleSwitch, CyberSlider, EffectSlider } from './controls';

interface GlitchSliderConfig {
    key: keyof GlitchSettings;
    label: string;
    description: string;
}

const glitchEffects: GlitchSliderConfig[] = [
    { key: 'rgbSplit', label: 'RGB SPLIT', description: '色差分离' },
    { key: 'vertexDisplacement', label: 'VERTEX', description: '顶点抖动' },
    { key: 'glitchBands', label: 'BANDS', description: '故障条带' },
    { key: 'flickerBands', label: 'FLICKER', description: '闪烁带' },
    { key: 'colorInvert', label: 'INVERT', description: '颜色反转' },
    { key: 'strobe', label: 'STROBE', description: '频闪' },
    { key: 'noiseOverlay', label: 'NOISE', description: '噪点' },
    { key: 'scanlineVariation', label: 'SCANLINE', description: '扫描线' },
];

interface GlitchTabProps {
    onSave: () => void;
    saveFlash: boolean;
}

/**
 * GlitchTab - Glitch 效果控制面板
 */
export const GlitchTab = ({ onSave, saveFlash }: GlitchTabProps) => {
    const { glitchSettings, setGlitchSetting, resetGlitchSettings } = useAppStore();

    return (
        <div className="space-y-3">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between py-1.5 border-b border-cyan-900/30">
                <div className="flex items-center gap-2">
                    <i className="ri-bug-line text-cyan-500 text-sm" />
                    <span className="text-[10px] font-bold text-cyan-300 tracking-wider uppercase">ENABLED</span>
                </div>
                <ToggleSwitch value={glitchSettings.enabled} onChange={(v) => setGlitchSetting('enabled', v)} />
            </div>

            {/* Master Intensity */}
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] text-cyan-600 uppercase tracking-wider">Master Intensity</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{(glitchSettings.masterIntensity * 100).toFixed(0)}%</span>
                </div>
                <CyberSlider
                    value={glitchSettings.masterIntensity}
                    onChange={(v) => setGlitchSetting('masterIntensity', v)}
                    disabled={!glitchSettings.enabled}
                />
            </div>

            {/* Individual Effects */}
            <div className="space-y-2 pt-1">
                <p className="text-[9px] text-cyan-700 uppercase tracking-wider">Individual Effects</p>
                {glitchEffects.map((effect) => (
                    <EffectSlider
                        key={effect.key}
                        label={effect.label}
                        description={effect.description}
                        value={glitchSettings[effect.key] as number}
                        onChange={(v) => setGlitchSetting(effect.key, v)}
                        disabled={!glitchSettings.enabled}
                    />
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
                <button
                    onClick={onSave}
                    className={`flex-1 py-1.5 border text-[10px] uppercase tracking-wider transition-all ${saveFlash
                            ? 'border-green-500 bg-green-500/20 text-green-300'
                            : 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:border-cyan-400'
                        }`}
                >
                    <i className={`ri-${saveFlash ? 'check' : 'save'}-line mr-1`} />
                    {saveFlash ? 'Saved!' : 'Save'}
                </button>
                <button
                    onClick={resetGlitchSettings}
                    className="flex-1 py-1.5 border border-cyan-800/50 text-cyan-600 text-[10px] uppercase tracking-wider hover:border-cyan-600 hover:text-cyan-400 transition-all"
                >
                    <i className="ri-refresh-line mr-1" />
                    Reset
                </button>
            </div>
        </div>
    );
};
