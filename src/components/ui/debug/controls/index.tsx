/**
 * 共享控件组件 - Debug Panel 专用
 */

interface ToggleSwitchProps {
    value: boolean;
    onChange: (v: boolean) => void;
}

export const ToggleSwitch = ({ value, onChange }: ToggleSwitchProps) => (
    <button
        onClick={() => onChange(!value)}
        className={`w-8 h-4 relative border transition-all duration-300 ${value ? 'border-cyan-500 bg-cyan-500/30' : 'border-cyan-800/50 bg-cyan-950/30'
            }`}
    >
        <div className={`absolute top-0.5 w-3 h-3 bg-cyan-400 transition-all duration-300 ${value ? 'left-4' : 'left-0.5'}`} />
    </button>
);

interface CyberSliderProps {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}

export const CyberSlider = ({ value, onChange, min = 0, max = 1, step = 0.01, disabled }: CyberSliderProps) => {
    const percent = ((value - min) / (max - min)) * 100;
    return (
        <div className={`relative h-5 group ${disabled ? 'opacity-40' : ''}`}>
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-cyan-950 border border-cyan-800/50">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 to-cyan-400" style={{ width: `${percent}%` }} />
            </div>
            <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-cyan-400 border border-cyan-300 shadow-[0_0_6px_rgba(0,240,255,0.5)] transition-transform group-hover:scale-110"
                style={{ left: `calc(${percent}% - 4px)` }}
            />
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => !disabled && onChange(parseFloat(e.target.value))}
                disabled={disabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
        </div>
    );
};

interface EffectSliderProps {
    label: string;
    description: string;
    value: number;
    onChange: (v: number) => void;
    disabled?: boolean;
}

export const EffectSlider = ({ label, description, value, onChange, disabled }: EffectSliderProps) => {
    const isActive = value > 0;
    return (
        <div className={`space-y-0.5 ${disabled ? 'opacity-40' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 transition-all ${isActive ? 'bg-cyan-400 shadow-[0_0_4px_rgba(0,240,255,0.8)]' : 'bg-cyan-800'}`} />
                    <span className="text-[9px] font-semibold text-cyan-500 tracking-wider">{label}</span>
                    <span className="text-[8px] text-cyan-800">{description}</span>
                </div>
                <span className="text-[9px] text-cyan-600 font-mono w-8 text-right">{(value * 100).toFixed(0)}%</span>
            </div>
            <CyberSlider value={value} onChange={onChange} disabled={disabled} />
        </div>
    );
};

interface ColorInputProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
}

export const ColorInput = ({ label, value, onChange }: ColorInputProps) => (
    <div className="flex-1 space-y-0.5">
        <span className="text-[8px] text-cyan-700 uppercase">{label}</span>
        <div className="flex items-center gap-1 border border-cyan-800/50 p-1 bg-cyan-950/30">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-5 h-5 bg-transparent cursor-pointer border-0"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 bg-transparent text-[9px] text-cyan-400 font-mono uppercase w-14 outline-none"
            />
        </div>
    </div>
);
