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
        <div className={`relative h-6 group flex items-center ${disabled ? 'opacity-40' : ''}`}>
            {/* 1px Track Line */}
            <div className="absolute left-0 right-0 h-[1px] bg-brand-primary/20 group-hover:bg-brand-primary/40 transition-colors" />

            {/* 2px Endpoints */}
            <div className="absolute left-0 w-[2px] h-[2px] bg-brand-primary" />
            <div className="absolute right-0 w-[2px] h-[2px] bg-brand-primary" />

            {/* Chamfered Square Thumb */}
            <div
                className="absolute w-3.5 h-3.5 bg-brand-secondary shadow-[0_0_10px_var(--color-brand-secondary)] transition-all duration-200 cursor-pointer z-10"
                style={{
                    left: `calc(${percent}% - 7px)`,
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%)"
                }}
            />

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => !disabled && onChange(parseFloat(e.target.value))}
                disabled={disabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
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
    min?: number;
    max?: number;
    step?: number;
}

export const EffectSlider = ({ label, description, value, onChange, disabled, min = 0, max = 1, step = 0.01 }: EffectSliderProps) => {
    const isActive = value > min;
    // Display as percentage if range is 0-1, otherwise show raw value
    const displayValue = max <= 1 ? `${(value * 100).toFixed(0)}%` : `${value}`;
    return (
        <div className={`space-y-0.5 ${disabled ? 'opacity-40' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 transition-all ${isActive ? 'bg-cyan-400 shadow-[0_0_4px_rgba(0,240,255,0.8)]' : 'bg-cyan-800'}`} />
                    <span className="text-[9px] font-semibold text-cyan-500 tracking-wider">{label}</span>
                    <span className="text-[8px] text-cyan-800">{description}</span>
                </div>
                <span className="text-[9px] text-cyan-600 font-mono w-12 text-right">{displayValue}</span>
            </div>
            <CyberSlider value={value} onChange={onChange} disabled={disabled} min={min} max={max} step={step} />
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
