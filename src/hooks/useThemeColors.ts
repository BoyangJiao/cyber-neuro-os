import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

interface ThemeColors {
    primary: string;
    secondary: string;
    glitchPrimary: string;
    glitchSecondary: string;
    background: string;
}

// Fallback colors matching 'cyan' theme as safe default
const DEFAULT_COLORS: ThemeColors = {
    primary: '#00F0FF',
    secondary: '#00A3B3',
    glitchPrimary: '#00F0FF',
    glitchSecondary: '#FF0055',
    background: '#000000',
};

/**
 * Hook to access actual resolved CSS variable colors in JavaScript/React/Three.js
 * Automatically updates when the theme changes in useAppStore.
 */
export const useThemeColors = (): ThemeColors => {
    const brandTheme = useAppStore((state) => state.brandTheme);
    const [colors, setColors] = useState<ThemeColors>(DEFAULT_COLORS);

    useEffect(() => {
        // We use a small timeout to ensure the DOM has updated the [data-theme] attribute
        // and the CSS variables have been recalculated by the browser.
        const updateColors = () => {
            if (typeof window === 'undefined') return;

            const rootStyle = getComputedStyle(document.documentElement);
            const getVar = (name: string) => rootStyle.getPropertyValue(name).trim();

            const primary = getVar('--color-brand-primary');

            // If primary is empty, CSS might not have loaded or variable is missing. Return early to keep defaults.
            if (!primary) return;

            setColors({
                primary,
                secondary: getVar('--color-brand-secondary') || DEFAULT_COLORS.secondary,
                glitchPrimary: getVar('--color-glitch-primary') || DEFAULT_COLORS.glitchPrimary,
                glitchSecondary: getVar('--color-glitch-secondary') || DEFAULT_COLORS.glitchSecondary,
                background: getVar('--color-bg-app') || DEFAULT_COLORS.background,
            });
        };

        // Run immediately (for initial load if already set)
        updateColors();

        // Run after a tick to allow React layout effects to propagate theme changes
        const timer = requestAnimationFrame(() => {
            updateColors();
            // Double check for slower recalculations
            setTimeout(updateColors, 50);
        });

        return () => cancelAnimationFrame(timer);
    }, [brandTheme]);

    return colors;
};
