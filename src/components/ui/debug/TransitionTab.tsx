import { useSettingsStore, type TransitionGlitchSettings } from '../../../store/useSettingsStore';
import { ToggleSwitch, EffectSlider } from './controls';

interface TransitionSliderConfig {
    key: keyof TransitionGlitchSettings;
    label: string;
    description: string;
    min: number;
    max: number;
    step: number;
}

const transitionEffects: TransitionSliderConfig[] = [
    { key: 'rgbSplit', label: 'RGB SPLIT', description: 'RGB分离距离', min: 0, max: 30, step: 1 },
    { key: 'skewAngle', label: 'SKEW', description: '倾斜角度', min: 0, max: 20, step: 1 },
    { key: 'displacement', label: 'SHIFT', description: '位移距离', min: 0, max: 30, step: 1 },
    { key: 'flickerIntensity', label: 'FLICKER', description: '闪烁强度', min: 0, max: 1, step: 0.05 },
    { key: 'sliceAmount', label: 'SLICE', description: '切片程度', min: 0, max: 1, step: 0.05 },
    { key: 'duration', label: 'DURATION', description: '时长(ms)', min: 100, max: 800, step: 50 },
    { key: 'hueRotate', label: 'HUE', description: '色调旋转', min: 0, max: 180, step: 5 },
    { key: 'colorInvert', label: 'INVERT', description: '颜色反转', min: 0, max: 1, step: 0.05 },
    { key: 'saturate', label: 'SATURATE', description: '饱和度', min: 0.5, max: 2, step: 0.1 },
];

interface TransitionTabProps {
    onSave: () => void;
    saveFlash: boolean;
}

/**
 * TransitionTab - Mission Briefing 切换 Glitch 效果控制面板
 */
export const TransitionTab = ({ onSave, saveFlash }: TransitionTabProps) => {
    const { transitionGlitchSettings, setTransitionGlitchSetting, resetTransitionGlitchSettings } = useSettingsStore();

    return (
        <div className="space-y-3">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between py-1.5 border-b border-cyan-900/30">
                <div className="flex items-center gap-2">
                    <i className="ri-slideshow-3-line text-cyan-500 text-sm" />
                    <span className="text-[10px] font-bold text-cyan-300 tracking-wider uppercase">ENABLED</span>
                </div>
                <ToggleSwitch value={transitionGlitchSettings.enabled} onChange={(v) => setTransitionGlitchSetting('enabled', v)} />
            </div>

            {/* Individual Effects */}
            <div className="space-y-2 pt-1">
                <p className="text-[9px] text-cyan-700 uppercase tracking-wider">Transition Parameters</p>
                {transitionEffects.map((effect) => (
                    <EffectSlider
                        key={effect.key}
                        label={effect.label}
                        description={effect.description}
                        value={transitionGlitchSettings[effect.key] as number}
                        onChange={(v) => setTransitionGlitchSetting(effect.key, v)}
                        disabled={!transitionGlitchSettings.enabled}
                        min={effect.min}
                        max={effect.max}
                        step={effect.step}
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
                    onClick={resetTransitionGlitchSettings}
                    className="flex-1 py-1.5 border border-cyan-800/50 text-cyan-600 text-[10px] uppercase tracking-wider hover:border-cyan-600 hover:text-cyan-400 transition-all"
                >
                    <i className="ri-refresh-line mr-1" />
                    Reset
                </button>
            </div>
        </div>
    );
};
