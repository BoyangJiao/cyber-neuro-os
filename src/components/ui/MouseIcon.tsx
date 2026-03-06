import { twMerge } from 'tailwind-merge';

interface MouseIconProps {
    size?: number | string;
    className?: string;
    fillLeft?: string;
    fillRight?: string;
    colorBorder?: string;
    colorWheelLeft?: string;
    colorWheelRight?: string;
}

export const MouseIcon = ({
    size = 24,
    className,
    fillLeft = 'transparent',
    fillRight = 'var(--color-brand-secondary)',
    colorBorder = 'var(--color-brand-secondary)',
    colorWheelLeft = 'var(--color-brand-primary)',
    colorWheelRight = 'var(--color-brand-primary)'
}: MouseIconProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={twMerge("inline-block", className)}
        >
            <path
                d="M17.76 17.7001L11.88 20.1501L6 17.7001V5.45012L11.88 3.00012L17.76 5.45012V17.7001Z"
                fill={fillLeft}
            />
            <path
                d="M11.88 3.00012L17.76 5.45012V17.7001L11.88 20.1501V3.00012Z"
                fill={fillRight}
            />
            {/* Left half of the wheel: light (to contrast with transparent/dark left background) */}
            <rect x="11.3799" y="5.38013" width="1.5" height="3.5" fill={colorWheelLeft} />
            {/* Right half of the wheel: dark (to contrast with primary right background) */}
            <rect x="11.8799" y="5.38013" width="1.5" height="3.5" fill={colorWheelRight} />
            <path
                d="M17.76 17.7001L11.88 20.1501L6 17.7001V5.45012L11.88 3.00012L17.76 5.45012V17.7001Z"
                stroke={colorBorder}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
