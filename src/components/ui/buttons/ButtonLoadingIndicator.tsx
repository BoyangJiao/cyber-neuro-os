import React from 'react';

/**
 * ButtonLoadingIndicator - Shared loading state component for all button variants
 * Displays animated bars with "PROCESSING" text
 */
export const ButtonLoadingIndicator: React.FC = () => (
    <span className="flex gap-1 items-center">
        <span className="w-1 h-3 bg-current animate-[pulse_0.6s_ease-in-out_infinite]" />
        <span className="w-1 h-4 bg-current animate-[pulse_0.6s_ease-in-out_0.1s_infinite]" />
        <span className="w-1 h-2 bg-current animate-[pulse_0.6s_ease-in-out_0.2s_infinite]" />
        <span className="ml-2 font-mono">PROCESSING</span>
    </span>
);
