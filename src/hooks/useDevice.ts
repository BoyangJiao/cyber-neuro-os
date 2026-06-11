import { useSyncExternalStore } from 'react';

/**
 * useDevice — single source of truth for device/viewport classification.
 *
 * The mobile/desktop split mirrors the Tailwind `lg` breakpoint (1024px) that
 * the entire layout system keys off (`hidden lg:flex` sidebars, FeaturePanel's
 * dual views, the nav drawer). If the design breakpoint ever moves, it must
 * move here too — never hardcode a second width check elsewhere.
 *
 * Pointer coarseness is tracked separately from viewport width: an iPad in
 * landscape is ≥1024px (desktop layout) but still touch-driven, so hover/
 * cursor features must key off `useIsCoarsePointer`, not `useIsMobile`.
 */
const MOBILE_QUERY = '(max-width: 1023.98px)';
const COARSE_QUERY = '(pointer: coarse)';

const mqlCache = new Map<string, MediaQueryList>();
const getMql = (query: string): MediaQueryList => {
    let mql = mqlCache.get(query);
    if (!mql) {
        mql = window.matchMedia(query);
        mqlCache.set(query, mql);
    }
    return mql;
};

const makeSubscribe = (query: string) => (onChange: () => void) => {
    const mql = getMql(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
};

const subscribeMobile = makeSubscribe(MOBILE_QUERY);
const subscribeCoarse = makeSubscribe(COARSE_QUERY);

/** Non-hook getters for imperative code (Three.js setup, one-shot config). */
export const isMobileViewport = () => getMql(MOBILE_QUERY).matches;
export const isCoarsePointer = () => getMql(COARSE_QUERY).matches;

/** Viewport below the `lg` (1024px) layout breakpoint. */
export const useIsMobile = (): boolean =>
    useSyncExternalStore(subscribeMobile, isMobileViewport);

/** Primary input is touch — gates hover-dependent and cursor features. */
export const useIsCoarsePointer = (): boolean =>
    useSyncExternalStore(subscribeCoarse, isCoarsePointer);
