import { useIsMobile } from '../../../../hooks/useDevice';

/**
 * CMS-authored module padding → inline style values.
 *
 * Padding values in Sanity are authored against the 1440px desktop baseline
 * (large spacers run 160–240px). On mobile they're clamped so a desktop
 * spacer can't swallow a third of a phone screen.
 */
const MOBILE_MAX_PADDING = 64;

const getPaddingValue = (val: number | string | undefined, defaultVal: number): number => {
    if (typeof val === 'number') return val;
    // Legacy string mappings
    if (val === 'small') return 16;
    if (val === 'medium') return 24;
    if (val === 'large') return 160;
    if (val === 'extra-large') return 240;
    if (val === 'none') return 0;
    return defaultVal;
};

interface PaddedModule {
    paddingTop?: number | string;
    paddingBottom?: number | string;
}

export const useModulePadding = (module: PaddedModule) => {
    const isMobile = useIsMobile();
    const pt = getPaddingValue(module.paddingTop, 16);
    const pb = getPaddingValue(module.paddingBottom, 160);

    const clamp = (v: number) => (isMobile ? Math.min(v, MOBILE_MAX_PADDING) : v);

    return {
        paddingTop: `${clamp(pt)}px`,
        paddingBottom: `${clamp(pb)}px`,
    };
};
