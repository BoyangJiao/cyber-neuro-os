import React from 'react';
import type { SVGProps } from 'react';

export const BadgeProtocol: React.FC<SVGProps<SVGSVGElement>> = React.memo(({ className = '', style, ...props }) => {
  return (
    <svg viewBox="0 0 52 26" fill="none" className={`text-brand-primary ${className}`} style={style} {...props}>

      <path d="M13 6H0V2H13V6Z" fill="currentColor" />
      <path opacity="0.3" d="M52 6H39V2H52V6Z" fill="currentColor" />
      <path d="M26 9H13V5H26V9Z" fill="currentColor" />
      <path opacity="0.3" d="M13 12H0V8H13V12Z" fill="currentColor" />
      <path opacity="0.3" d="M39 12H26V8H39V12Z" fill="currentColor" />
      <path d="M26 16H13V12H26V16Z" fill="currentColor" />
      <path d="M52 16H39V12H52V16Z" fill="currentColor" />
      <path d="M13 18.8H0V14.8H13V18.8Z" fill="currentColor" />
      <path d="M39 21.6H26V17.6H39V21.6Z" fill="currentColor" />
      <path d="M13 24.4H0V20.4H13V24.4Z" fill="currentColor" />
      <path d="M52 24.4H39V20.4H52V24.4Z" fill="currentColor" />

    </svg>
  );
});
