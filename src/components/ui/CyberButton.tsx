import { type ReactNode } from 'react';
import { NeuroButton } from './buttons/NeuroButton';
import { ChamferButton } from './buttons/ChamferButton';
import { GhostButton } from './buttons/GhostButton';
import { CornerButton } from './buttons/CornerButton';

export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'corner' | 'chamfer' | 'ghost' | 'dot';
    size?: 'sm' | 'md' | 'lg';
    icon?: ReactNode;
    loading?: boolean;
    chamferCorner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color?: 'cyan' | 'green';
    iconOnly?: boolean;
    showGhost?: boolean;
    ghostOffset?: string;
}

/**
 * CyberButton - Facade Component
 * Delegates to specific button implementations based on variant.
 */
export const CyberButton = ({
    variant = 'corner',
    chamferCorner,
    showGhost,
    ghostOffset,
    ...props
}: CyberButtonProps) => {
    switch (variant) {
        case 'dot': // Neuro
            return <NeuroButton showGhost={showGhost} ghostOffset={ghostOffset} {...props} />;

        case 'chamfer': // Cyber
            return <ChamferButton corner={chamferCorner} {...props} />;

        case 'ghost': // Ghost
            return <GhostButton {...props} />;

        case 'corner': // Corner (Proximity)
        default:
            return <CornerButton {...props} />;
    }
};
