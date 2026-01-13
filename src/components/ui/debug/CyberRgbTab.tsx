import { useAppStore } from '../../../store/useAppStore';
import { ToggleSwitch, EffectSlider, ColorInput } from './controls';

interface CyberRgbTabProps {
    onSave: () => void;
    saveFlash: boolean;
}

/**
 * CyberRgbTab - Cyber RGB 效果控制面板
 */
export const CyberRgbTab = ({ onSave, saveFlash }: CyberRgbTabProps) => {
    const { cyberRgbSettings, setCyberRgbSetting, resetCyberRgbSettings } = useAppStore();

    return (
        <div className="space-y-3">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between py-1.5 border-b border-cyan-900/30">
                <div className="flex items-center gap-2">
                    <i className="ri-palette-line text-pink-500 text-sm" />
                    <span className="text-[10px] font-bold text-cyan-300 tracking-wider uppercase">ENABLED</span>
                </div>
                <ToggleSwitch value={cyberRgbSettings.enabled} onChange={(v) => setCyberRgbSetting('enabled', v)} />
            </div>

            {/* Color Count */}
            <div className="space-y-1">
                <span className="text-[9px] text-cyan-600 uppercase tracking-wider">Color Count</span>
                <div className="flex gap-2">
                    {([2, 3] as const).map((count) => (
                        <button
                            key={count}
                            onClick={() => setCyberRgbSetting('colorCount', count)}
                            className={`flex-1 py-1 border text-[10px] transition-all ${cyberRgbSettings.colorCount === count
                                    ? 'border-pink-500 bg-pink-500/20 text-pink-300'
                                    : 'border-cyan-800/50 text-cyan-600 hover:border-cyan-600'
                                }`}
                        >
                            {count} Colors
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Pickers */}
            <div className="space-y-2">
                <span className="text-[9px] text-cyan-600 uppercase tracking-wider">Colors</span>
                <div className="flex gap-2">
                    <ColorInput label="A" value={cyberRgbSettings.colorA} onChange={(v) => setCyberRgbSetting('colorA', v)} />
                    <ColorInput label="B" value={cyberRgbSettings.colorB} onChange={(v) => setCyberRgbSetting('colorB', v)} />
                    {cyberRgbSettings.colorCount === 3 && (
                        <ColorInput label="C" value={cyberRgbSettings.colorC} onChange={(v) => setCyberRgbSetting('colorC', v)} />
                    )}
                </div>
            </div>

            {/* Sliders */}
            <EffectSlider
                label="COLOR SPEED"
                description="变化速度"
                value={cyberRgbSettings.colorSpeed}
                onChange={(v) => setCyberRgbSetting('colorSpeed', v)}
                disabled={!cyberRgbSettings.enabled}
            />
            <EffectSlider
                label="MIX INTENSITY"
                description="混合强度"
                value={cyberRgbSettings.colorMixIntensity}
                onChange={(v) => setCyberRgbSetting('colorMixIntensity', v)}
                disabled={!cyberRgbSettings.enabled}
            />
            <EffectSlider
                label="SCAN SPEED"
                description="扫描速度"
                value={cyberRgbSettings.scanlineSpeed}
                onChange={(v) => setCyberRgbSetting('scanlineSpeed', v)}
                disabled={!cyberRgbSettings.enabled}
            />
            <EffectSlider
                label="SCAN WIDTH"
                description="扫描宽度"
                value={cyberRgbSettings.scanlineWidth}
                onChange={(v) => setCyberRgbSetting('scanlineWidth', v)}
                disabled={!cyberRgbSettings.enabled}
            />

            {/* Direction */}
            <div className="space-y-1">
                <span className="text-[9px] text-cyan-600 uppercase tracking-wider">Scan Direction</span>
                <div className="flex gap-1">
                    {(['horizontal', 'vertical', 'both'] as const).map((dir) => (
                        <button
                            key={dir}
                            onClick={() => setCyberRgbSetting('scanlineDirection', dir)}
                            className={`flex-1 py-1 border text-[9px] transition-all ${cyberRgbSettings.scanlineDirection === dir
                                    ? 'border-pink-500 bg-pink-500/20 text-pink-300'
                                    : 'border-cyan-800/50 text-cyan-600 hover:border-cyan-600'
                                }`}
                        >
                            {dir === 'horizontal' ? 'H' : dir === 'vertical' ? 'V' : 'BOTH'}
                        </button>
                    ))}
                </div>
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
                    onClick={resetCyberRgbSettings}
                    className="flex-1 py-1.5 border border-cyan-800/50 text-cyan-600 text-[10px] uppercase tracking-wider hover:border-cyan-600 hover:text-cyan-400 transition-all"
                >
                    <i className="ri-refresh-line mr-1" />
                    Reset
                </button>
            </div>
        </div>
    );
};
