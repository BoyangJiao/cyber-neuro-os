import { useEffect } from 'react';

/**
 * Hook to dynamically measure header and footer heights and set them as CSS variables.
 * This ensures that overlay components like ProjectDetail can perfectly align between them.
 */
export const useLayoutMetrics = () => {
    useEffect(() => {
        const updateMetrics = () => {
            const header = document.getElementById('site-header');
            const footer = document.getElementById('site-footer');

            if (header) {
                const headerHeight = header.getBoundingClientRect().height;
                document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
            }

            if (footer) {
                const footerHeight = footer.getBoundingClientRect().height;
                document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
            }
        };

        // Initial measurement
        updateMetrics();

        // Use ResizeObserver for responsive updates (when window resizes or content changes)
        const resizeObserver = new ResizeObserver(() => {
            updateMetrics();
        });

        const header = document.getElementById('site-header');
        const footer = document.getElementById('site-footer');

        if (header) resizeObserver.observe(header);
        if (footer) resizeObserver.observe(footer);

        // Also update on window resize as a fallback
        window.addEventListener('resize', updateMetrics);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateMetrics);
        };
    }, []);
};
