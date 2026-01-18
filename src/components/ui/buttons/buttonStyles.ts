/**
 * Shared button styles and constants
 * Used across all button variants for consistency
 */

export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Base size styles for buttons
 * Returns size classes based on size and iconOnly props
 */
export const getButtonSizeStyles = (size: ButtonSize, iconOnly: boolean = false): string => {
    const styles: Record<ButtonSize, { icon: string; text: string }> = {
        sm: {
            icon: "px-2 h-8 text-xs",
            text: "px-4 py-2 text-xs",
        },
        md: {
            icon: "px-4 h-10 text-sm",
            text: "px-8 py-3 text-sm min-w-[120px]",
        },
        lg: {
            icon: "px-6 h-12 text-base",
            text: "px-10 py-4 text-base min-w-[160px]",
        },
    };

    return iconOnly ? styles[size].icon : styles[size].text;
};

/**
 * Base styles applied to all button variants
 */
export const buttonBaseStyles = "relative inline-flex items-center justify-center font-display font-medium uppercase tracking-[0.2em] transition-all duration-300 group outline-none select-none z-0";

/**
 * Disabled state styles
 */
export const buttonDisabledStyles = "opacity-50 cursor-not-allowed grayscale pointer-events-none";
