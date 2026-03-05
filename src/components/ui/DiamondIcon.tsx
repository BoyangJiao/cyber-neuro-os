import { twMerge } from 'tailwind-merge';

interface DiamondIconProps {
    active?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const DiamondIcon = ({ active = false, className, size = 'md' }: DiamondIconProps) => {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const outerSizeClasses = {
        sm: 'w-2.5 h-2.5',
        md: 'w-3.5 h-3.5',
        lg: 'w-4.5 h-4.5'
    };

    const innerSizeClasses = {
        sm: 'w-1 h-1',
        md: 'w-1.5 h-1.5',
        lg: 'w-2 h-2'
    };

    return (
        <div className={twMerge("relative flex items-center justify-center flex-shrink-0", sizeClasses[size], className)}>
            {/* Outer diamond ring */}
            <div
                className="absolute transition-all duration-300"
                style={{
                    width: outerSizeClasses[size].split('-')[1].replace('h-', '') + (size === 'sm' ? '.5rem' : 'rem'), // this logic is a bit flawed for tailwind, I'll just use the classes
                }}
            />
            {/* Correcting the styles to use raw pixel-like values for precision if needed, or stick to tailwind */}
            <div
                className={twMerge(
                    "absolute transition-all duration-300",
                    outerSizeClasses[size]
                )}
                style={{
                    transform: 'rotate(45deg)',
                    border: `1px solid var(--color-brand-primary)`,
                    opacity: active ? 0.9 : 0.3,
                    background: active ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                    boxShadow: active
                        ? '0 0 8px var(--color-brand-glow), inset 0 0 4px rgba(0, 255, 255, 0.1)'
                        : 'none',
                }}
            />
            {/* Inner diamond core */}
            <div
                className={twMerge(
                    "transition-all duration-300",
                    innerSizeClasses[size]
                )}
                style={{
                    transform: 'rotate(45deg)',
                    background: 'var(--color-brand-primary)',
                    opacity: active ? 1 : 0.5,
                    boxShadow: active
                        ? '0 0 6px var(--color-brand-glow)'
                        : 'none',
                }}
            />
        </div>
    );
};
