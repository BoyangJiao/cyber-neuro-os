import { useState, useEffect } from 'react';

/**
 * Returns `false` when the tab / window is hidden (user switched tab, minimized window).
 * Components can use this to pause expensive animation loops.
 *
 * Uses the Page Visibility API under the hood.
 */
export const usePageVisible = (): boolean => {
    const [visible, setVisible] = useState(!document.hidden);

    useEffect(() => {
        const onChange = () => setVisible(!document.hidden);
        document.addEventListener('visibilitychange', onChange);
        return () => document.removeEventListener('visibilitychange', onChange);
    }, []);

    return visible;
};
