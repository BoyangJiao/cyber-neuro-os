import React from 'react';

interface BarcodeProps extends React.SVGProps<SVGSVGElement> { }

export const Barcode: React.FC<BarcodeProps> = (props) => {
    return (
        <svg
            width="78"
            height="38"
            viewBox="0 0 78 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M9.18359 38H14.0484V0H9.18359V38Z"
                fill="currentColor"
            />
            <path
                d="M0 38H2.15913V0H0V38Z"
                fill="currentColor"
            />
            <path
                d="M63.4058 38H63.8431V0H63.4058V38Z"
                fill="currentColor"
            />
            <path
                d="M32.0859 38H32.6598V0H32.0859V38Z"
                fill="currentColor"
            />
            <path
                d="M17.8198 38H18.3937V0H17.8198V38Z"
                fill="currentColor"
            />
            <path
                d="M4.75537 38H5.35662V0H4.75537V38Z"
                fill="currentColor"
            />
            <path
                d="M67.0962 38H71.9337V0H67.0962V38Z"
                fill="currentColor"
            />
            <path
                d="M49.8501 38H52.0092V0H49.8501V38Z"
                fill="currentColor"
            />
            <path
                d="M59.9355 38H60.7828V0H59.9355V38Z"
                fill="currentColor"
            />
            <path
                d="M15.0044 38H15.305V0H15.0044V38Z"
                fill="currentColor"
            />
            <path
                d="M55.7808 38H56.2181V0H55.7808V38Z"
                fill="currentColor"
            />
            <path
                d="M44.0566 38H46.2157V0H44.0566V38Z"
                fill="currentColor"
            />
            <path
                d="M75.8408 38H77.9999V0H75.8408V38Z"
                fill="currentColor"
            />
            <path
                d="M22.165 38H29.1342V0H22.165V38Z"
                fill="currentColor"
            />
            <path
                d="M36.2671 38H41.1865V0H36.2671V38Z"
                fill="currentColor"
            />
        </svg>

    );
};
