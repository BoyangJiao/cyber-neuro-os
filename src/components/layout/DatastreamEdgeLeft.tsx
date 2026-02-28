import React from 'react';
import type { SVGProps } from 'react';

export const DatastreamEdgeLeft: React.FC<SVGProps<SVGSVGElement> & { isBooting?: boolean }> = ({ className = '', style, isBooting = true, ...props }) => {
  return (
    <svg viewBox="0 0 20 748" fill="none" className={`text-brand-primary datastream-edge-svg datastream-edge-left ${isBooting ? 'is-loading' : ''} ${className}`} style={style} {...props}>

      <g className="core-stream">
        <path d="M4 75.62L6.59808 80.12H1.40192L4 75.62Z" fill="currentColor" />
        <path d="M4.35992 87.5V86.42H3.81995V87.5H4.35992Z" fill="currentColor" />
        <path d="M6.15989 85.7H1.83984V86.42H6.15989V85.7Z" fill="currentColor" />
        <path d="M2.55989 86.42V84.62H1.83984V86.42L2.55989 86.42Z" fill="currentColor" />
        <path d="M6.15989 86.42L6.15985 84.62H5.61987V86.42L6.15989 86.42Z" fill="currentColor" />
        <path d="M4 96.5L1.40192 92H6.59808L4 96.5Z" fill="currentColor" />
        <rect width="6" height="7" transform="translate(1 224.5)" fill="currentColor" />
        <path d="M3.228 229.444V229.084C3.228 228.905 3.30267 228.759 3.452 228.644L4.224 228.036C4.35733 227.935 4.424 227.809 4.424 227.66V227.516C4.424 227.289 4.30933 227.176 4.08 227.176H3.836C3.612 227.176 3.5 227.289 3.5 227.516V227.68C3.5 227.72 3.48133 227.74 3.444 227.74H3.264C3.22933 227.74 3.212 227.72 3.212 227.68V227.512C3.212 227.328 3.264 227.185 3.368 227.084C3.472 226.98 3.616 226.928 3.8 226.928H4.12C4.304 226.928 4.448 226.98 4.552 227.084C4.656 227.185 4.708 227.328 4.708 227.512V227.676C4.708 227.884 4.62533 228.053 4.46 228.184L3.676 228.804C3.588 228.873 3.544 228.957 3.544 229.056V229.24H4.66C4.69733 229.24 4.716 229.259 4.716 229.296V229.444C4.716 229.481 4.69733 229.5 4.66 229.5H3.284C3.24667 229.5 3.228 229.481 3.228 229.444Z" fill="currentColor" />
        <text transform="rotate(90)" x="250" y="-3" fill="currentColor" opacity="0.5" className="font-[monospace] text-[6px] tracking-[0.2em]" style={{ letterSpacing: '2px', fontSize: '6px' }}>[0x0130449768x7719]</text>
        <path d="M4 516.5L6.59808 521H1.40192L4 516.5Z" fill="currentColor" />
        <path d="M4.35992 528.38V527.3H3.81995V528.38H4.35992Z" fill="currentColor" />
        <path d="M6.15989 526.58H1.83984V527.3H6.15989V526.58Z" fill="currentColor" />
        <path d="M2.55989 527.3V525.5H1.83984V527.3L2.55989 527.3Z" fill="currentColor" />
        <path d="M6.15989 527.3L6.15985 525.5H5.61987V527.3L6.15989 527.3Z" fill="currentColor" />
        <path d="M4 537.38L1.40192 532.88H6.59808L4 537.38Z" fill="currentColor" />
        <rect width="6" height="7" transform="translate(1 665.38)" fill="currentColor" />
        <path d="M3.228 670.324V669.964C3.228 669.785 3.30267 669.639 3.452 669.524L4.224 668.916C4.35733 668.815 4.424 668.689 4.424 668.54V668.396C4.424 668.169 4.30933 668.056 4.08 668.056H3.836C3.612 668.056 3.5 668.169 3.5 668.396V668.56C3.5 668.6 3.48133 668.62 3.444 668.62H3.264C3.22933 668.62 3.212 668.6 3.212 668.56V668.392C3.212 668.208 3.264 668.065 3.368 667.964C3.472 667.86 3.616 667.808 3.8 667.808H4.12C4.304 667.808 4.448 667.86 4.552 667.964C4.656 668.065 4.708 668.208 4.708 668.392V668.556C4.708 668.764 4.62533 668.933 4.46 669.064L3.676 669.684C3.588 669.753 3.544 669.837 3.544 669.936V670.12H4.66C4.69733 670.12 4.716 670.139 4.716 670.176V670.324C4.716 670.361 4.69733 670.38 4.66 670.38H3.284C3.24667 670.38 3.228 670.361 3.228 670.324Z" fill="currentColor" />
        <g className="datastream-brick" style={{ '--brick-idx': 1 } as React.CSSProperties}>
          <rect x="12" width="3" height="3" fill="currentColor" />
          <rect x="16" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 2 } as React.CSSProperties}>
          <rect x="12" y="5" width="5" height="3" fill="currentColor" />
          <rect x="18" y="5" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 3 } as React.CSSProperties}>
          <rect x="12" y="10" width="6" height="3" fill="currentColor" />
          <rect x="19" y="10" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 4 } as React.CSSProperties}>
          <rect x="12" y="15" width="3" height="3" fill="currentColor" />
          <rect x="16" y="15" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 5 } as React.CSSProperties}>
          <rect x="12" y="20" width="4" height="3" fill="currentColor" />
          <rect x="17" y="20" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 6 } as React.CSSProperties}>
          <rect x="12" y="25" width="3" height="3" fill="currentColor" />
          <rect x="16" y="25" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 7 } as React.CSSProperties}>
          <rect x="12" y="30" width="3" height="3" fill="currentColor" />
          <rect x="16" y="30" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 8 } as React.CSSProperties}>
          <rect x="12" y="35" width="5" height="3" fill="currentColor" />
          <rect x="18" y="35" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 9 } as React.CSSProperties}>
          <rect x="12" y="40" width="6" height="3" fill="currentColor" />
          <rect x="19" y="40" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 10 } as React.CSSProperties}>
          <rect x="12" y="45" width="3" height="3" fill="currentColor" />
          <rect x="16" y="45" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 11 } as React.CSSProperties}>
          <rect x="12" y="50" width="4" height="3" fill="currentColor" />
          <rect x="17" y="50" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 12 } as React.CSSProperties}>
          <rect x="12" y="55" width="3" height="3" fill="currentColor" />
          <rect x="16" y="55" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 13 } as React.CSSProperties}>
          <rect x="12" y="60" width="3" height="3" fill="currentColor" />
          <rect x="16" y="60" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 14 } as React.CSSProperties}>
          <rect x="12" y="65" width="5" height="3" fill="currentColor" />
          <rect x="18" y="65" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 15 } as React.CSSProperties}>
          <rect x="12" y="70" width="6" height="3" fill="currentColor" />
          <rect x="19" y="70" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 16 } as React.CSSProperties}>
          <rect x="12" y="75" width="3" height="3" fill="currentColor" />
          <rect x="16" y="75" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 17 } as React.CSSProperties}>
          <rect x="12" y="80" width="4" height="3" fill="currentColor" />
          <rect x="17" y="80" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 18 } as React.CSSProperties}>
          <rect x="12" y="85" width="3" height="3" fill="currentColor" />
          <rect x="16" y="85" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 19 } as React.CSSProperties}>
          <rect x="12" y="90" width="3" height="3" fill="currentColor" />
          <rect x="16" y="90" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 20 } as React.CSSProperties}>
          <rect x="12" y="95" width="5" height="3" fill="currentColor" />
          <rect x="18" y="95" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 21 } as React.CSSProperties}>
          <rect x="12" y="100" width="6" height="3" fill="currentColor" />
          <rect x="19" y="100" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 21 } as React.CSSProperties}>
          <rect x="12" y="105" width="3" height="3" fill="currentColor" />
          <rect x="16" y="105" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 22 } as React.CSSProperties}>
          <rect x="12" y="110" width="4" height="3" fill="currentColor" />
          <rect x="17" y="110" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 23 } as React.CSSProperties}>
          <rect x="12" y="115" width="3" height="3" fill="currentColor" />
          <rect x="16" y="115" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 24 } as React.CSSProperties}>
          <rect x="12" y="120" width="3" height="3" fill="currentColor" />
          <rect x="16" y="120" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 25 } as React.CSSProperties}>
          <rect x="12" y="125" width="5" height="3" fill="currentColor" />
          <rect x="18" y="125" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 26 } as React.CSSProperties}>
          <rect x="12" y="130" width="6" height="3" fill="currentColor" />
          <rect x="19" y="130" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 27 } as React.CSSProperties}>
          <rect x="12" y="135" width="3" height="3" fill="currentColor" />
          <rect x="16" y="135" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 28 } as React.CSSProperties}>
          <rect x="12" y="140" width="4" height="3" fill="currentColor" />
          <rect x="17" y="140" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 29 } as React.CSSProperties}>
          <rect x="12" y="145" width="3" height="3" fill="currentColor" />
          <rect x="16" y="145" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 30 } as React.CSSProperties}>
          <rect x="12" y="150" width="3" height="3" fill="currentColor" />
          <rect x="16" y="150" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 31 } as React.CSSProperties}>
          <rect x="12" y="155" width="5" height="3" fill="currentColor" />
          <rect x="18" y="155" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 32 } as React.CSSProperties}>
          <rect x="12" y="160" width="6" height="3" fill="currentColor" />
          <rect x="19" y="160" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 33 } as React.CSSProperties}>
          <rect x="12" y="165" width="3" height="3" fill="currentColor" />
          <rect x="16" y="165" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 34 } as React.CSSProperties}>
          <rect x="12" y="170" width="4" height="3" fill="currentColor" />
          <rect x="17" y="170" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 35 } as React.CSSProperties}>
          <rect x="12" y="175" width="3" height="3" fill="currentColor" />
          <rect x="16" y="175" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 36 } as React.CSSProperties}>
          <rect x="12" y="180" width="3" height="3" fill="currentColor" />
          <rect x="16" y="180" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 37 } as React.CSSProperties}>
          <rect x="12" y="185" width="5" height="3" fill="currentColor" />
          <rect x="18" y="185" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 38 } as React.CSSProperties}>
          <rect x="12" y="190" width="6" height="3" fill="currentColor" />
          <rect x="19" y="190" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 39 } as React.CSSProperties}>
          <rect x="12" y="195" width="3" height="3" fill="currentColor" />
          <rect x="16" y="195" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 40 } as React.CSSProperties}>
          <rect x="12" y="200" width="4" height="3" fill="currentColor" />
          <rect x="17" y="200" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 41 } as React.CSSProperties}>
          <rect x="12" y="205" width="3" height="3" fill="currentColor" />
          <rect x="16" y="205" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 42 } as React.CSSProperties}>
          <rect x="12" y="210" width="3" height="3" fill="currentColor" />
          <rect x="16" y="210" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 43 } as React.CSSProperties}>
          <rect x="12" y="215" width="5" height="3" fill="currentColor" />
          <rect x="18" y="215" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 44 } as React.CSSProperties}>
          <rect x="12" y="220" width="6" height="3" fill="currentColor" />
          <rect x="19" y="220" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 45 } as React.CSSProperties}>
          <rect x="12" y="225" width="3" height="3" fill="currentColor" />
          <rect x="16" y="225" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 46 } as React.CSSProperties}>
          <rect x="12" y="230" width="4" height="3" fill="currentColor" />
          <rect x="17" y="230" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 47 } as React.CSSProperties}>
          <rect x="12" y="235" width="3" height="3" fill="currentColor" />
          <rect x="16" y="235" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 48 } as React.CSSProperties}>
          <rect x="12" y="240" width="3" height="3" fill="currentColor" />
          <rect x="16" y="240" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 49 } as React.CSSProperties}>
          <rect x="12" y="245" width="5" height="3" fill="currentColor" />
          <rect x="18" y="245" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 50 } as React.CSSProperties}>
          <rect x="12" y="250" width="6" height="3" fill="currentColor" />
          <rect x="19" y="250" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 51 } as React.CSSProperties}>
          <rect x="12" y="255" width="3" height="3" fill="currentColor" />
          <rect x="16" y="255" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 52 } as React.CSSProperties}>
          <rect x="12" y="260" width="4" height="3" fill="currentColor" />
          <rect x="17" y="260" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 53 } as React.CSSProperties}>
          <rect x="12" y="265" width="3" height="3" fill="currentColor" />
          <rect x="16" y="265" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 54 } as React.CSSProperties}>
          <rect x="12" y="270" width="3" height="3" fill="currentColor" />
          <rect x="16" y="270" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 55 } as React.CSSProperties}>
          <rect x="12" y="275" width="5" height="3" fill="currentColor" />
          <rect x="18" y="275" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 56 } as React.CSSProperties}>
          <rect x="12" y="280" width="6" height="3" fill="currentColor" />
          <rect x="19" y="280" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 57 } as React.CSSProperties}>
          <rect x="12" y="285" width="3" height="3" fill="currentColor" />
          <rect x="16" y="285" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 58 } as React.CSSProperties}>
          <rect x="12" y="290" width="4" height="3" fill="currentColor" />
          <rect x="17" y="290" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 59 } as React.CSSProperties}>
          <rect x="12" y="295" width="3" height="3" fill="currentColor" />
          <rect x="16" y="295" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 60 } as React.CSSProperties}>
          <rect x="12" y="300" width="3" height="3" fill="currentColor" />
          <rect x="16" y="300" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 61 } as React.CSSProperties}>
          <rect x="12" y="305" width="5" height="3" fill="currentColor" />
          <rect x="18" y="305" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 62 } as React.CSSProperties}>
          <rect x="12" y="310" width="6" height="3" fill="currentColor" />
          <rect x="19" y="310" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 63 } as React.CSSProperties}>
          <rect x="12" y="315" width="3" height="3" fill="currentColor" />
          <rect x="16" y="315" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 64 } as React.CSSProperties}>
          <rect x="12" y="320" width="4" height="3" fill="currentColor" />
          <rect x="17" y="320" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 65 } as React.CSSProperties}>
          <rect x="12" y="325" width="3" height="3" fill="currentColor" />
          <rect x="16" y="325" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 66 } as React.CSSProperties}>
          <rect x="12" y="330" width="3" height="3" fill="currentColor" />
          <rect x="16" y="330" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 67 } as React.CSSProperties}>
          <rect x="12" y="335" width="5" height="3" fill="currentColor" />
          <rect x="18" y="335" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 68 } as React.CSSProperties}>
          <rect x="12" y="340" width="6" height="3" fill="currentColor" />
          <rect x="19" y="340" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 69 } as React.CSSProperties}>
          <rect x="12" y="345" width="3" height="3" fill="currentColor" />
          <rect x="16" y="345" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 70 } as React.CSSProperties}>
          <rect x="12" y="350" width="4" height="3" fill="currentColor" />
          <rect x="17" y="350" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 71 } as React.CSSProperties}>
          <rect x="12" y="355" width="3" height="3" fill="currentColor" />
          <rect x="16" y="355" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 72 } as React.CSSProperties}>
          <rect x="12" y="360" width="3" height="3" fill="currentColor" />
          <rect x="16" y="360" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 73 } as React.CSSProperties}>
          <rect x="12" y="365" width="5" height="3" fill="currentColor" />
          <rect x="18" y="365" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 74 } as React.CSSProperties}>
          <rect x="12" y="370" width="6" height="3" fill="currentColor" />
          <rect x="19" y="370" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 74 } as React.CSSProperties}>
          <rect x="12" y="375" width="3" height="3" fill="currentColor" />
          <rect x="16" y="375" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 75 } as React.CSSProperties}>
          <rect x="12" y="380" width="4" height="3" fill="currentColor" />
          <rect x="17" y="380" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 76 } as React.CSSProperties}>
          <rect x="12" y="385" width="3" height="3" fill="currentColor" />
          <rect x="16" y="385" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 77 } as React.CSSProperties}>
          <rect x="12" y="390" width="3" height="3" fill="currentColor" />
          <rect x="16" y="390" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 78 } as React.CSSProperties}>
          <rect x="12" y="395" width="5" height="3" fill="currentColor" />
          <rect x="18" y="395" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 79 } as React.CSSProperties}>
          <rect x="12" y="400" width="6" height="3" fill="currentColor" />
          <rect x="19" y="400" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 80 } as React.CSSProperties}>
          <rect x="12" y="405" width="3" height="3" fill="currentColor" />
          <rect x="16" y="405" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 81 } as React.CSSProperties}>
          <rect x="12" y="410" width="4" height="3" fill="currentColor" />
          <rect x="17" y="410" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 82 } as React.CSSProperties}>
          <rect x="12" y="415" width="3" height="3" fill="currentColor" />
          <rect x="16" y="415" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 83 } as React.CSSProperties}>
          <rect x="12" y="420" width="3" height="3" fill="currentColor" />
          <rect x="16" y="420" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 84 } as React.CSSProperties}>
          <rect x="12" y="425" width="5" height="3" fill="currentColor" />
          <rect x="18" y="425" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 85 } as React.CSSProperties}>
          <rect x="12" y="430" width="6" height="3" fill="currentColor" />
          <rect x="19" y="430" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 86 } as React.CSSProperties}>
          <rect x="12" y="435" width="3" height="3" fill="currentColor" />
          <rect x="16" y="435" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 87 } as React.CSSProperties}>
          <rect x="12" y="440" width="4" height="3" fill="currentColor" />
          <rect x="17" y="440" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 88 } as React.CSSProperties}>
          <rect x="12" y="445" width="3" height="3" fill="currentColor" />
          <rect x="16" y="445" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 89 } as React.CSSProperties}>
          <rect x="12" y="450" width="3" height="3" fill="currentColor" />
          <rect x="16" y="450" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 90 } as React.CSSProperties}>
          <rect x="12" y="455" width="5" height="3" fill="currentColor" />
          <rect x="18" y="455" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 91 } as React.CSSProperties}>
          <rect x="12" y="460" width="6" height="3" fill="currentColor" />
          <rect x="19" y="460" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 92 } as React.CSSProperties}>
          <rect x="12" y="465" width="3" height="3" fill="currentColor" />
          <rect x="16" y="465" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 93 } as React.CSSProperties}>
          <rect x="12" y="470" width="4" height="3" fill="currentColor" />
          <rect x="17" y="470" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 94 } as React.CSSProperties}>
          <rect x="12" y="475" width="3" height="3" fill="currentColor" />
          <rect x="16" y="475" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 95 } as React.CSSProperties}>
          <rect x="12" y="480" width="3" height="3" fill="currentColor" />
          <rect x="16" y="480" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 96 } as React.CSSProperties}>
          <rect x="12" y="485" width="5" height="3" fill="currentColor" />
          <rect x="18" y="485" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 97 } as React.CSSProperties}>
          <rect x="12" y="490" width="6" height="3" fill="currentColor" />
          <rect x="19" y="490" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 98 } as React.CSSProperties}>
          <rect x="12" y="495" width="3" height="3" fill="currentColor" />
          <rect x="16" y="495" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 99 } as React.CSSProperties}>
          <rect x="12" y="500" width="4" height="3" fill="currentColor" />
          <rect x="17" y="500" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 99 } as React.CSSProperties}>
          <rect x="12" y="505" width="3" height="3" fill="currentColor" />
          <rect x="16" y="505" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 100 } as React.CSSProperties}>
          <rect x="12" y="510" width="3" height="3" fill="currentColor" />
          <rect x="16" y="510" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 101 } as React.CSSProperties}>
          <rect x="12" y="515" width="5" height="3" fill="currentColor" />
          <rect x="18" y="515" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 102 } as React.CSSProperties}>
          <rect x="12" y="520" width="6" height="3" fill="currentColor" />
          <rect x="19" y="520" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 103 } as React.CSSProperties}>
          <rect x="12" y="525" width="3" height="3" fill="currentColor" />
          <rect x="16" y="525" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 104 } as React.CSSProperties}>
          <rect x="12" y="530" width="4" height="3" fill="currentColor" />
          <rect x="17" y="530" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 105 } as React.CSSProperties}>
          <rect x="12" y="535" width="3" height="3" fill="currentColor" />
          <rect x="16" y="535" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 106 } as React.CSSProperties}>
          <rect x="12" y="540" width="3" height="3" fill="currentColor" />
          <rect x="16" y="540" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 107 } as React.CSSProperties}>
          <rect x="12" y="545" width="5" height="3" fill="currentColor" />
          <rect x="18" y="545" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 108 } as React.CSSProperties}>
          <rect x="12" y="550" width="6" height="3" fill="currentColor" />
          <rect x="19" y="550" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 109 } as React.CSSProperties}>
          <rect x="12" y="555" width="3" height="3" fill="currentColor" />
          <rect x="16" y="555" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 110 } as React.CSSProperties}>
          <rect x="12" y="560" width="4" height="3" fill="currentColor" />
          <rect x="17" y="560" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 111 } as React.CSSProperties}>
          <rect x="12" y="565" width="3" height="3" fill="currentColor" />
          <rect x="16" y="565" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 112 } as React.CSSProperties}>
          <rect x="12" y="570" width="3" height="3" fill="currentColor" />
          <rect x="16" y="570" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 113 } as React.CSSProperties}>
          <rect x="12" y="575" width="5" height="3" fill="currentColor" />
          <rect x="18" y="575" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 114 } as React.CSSProperties}>
          <rect x="12" y="580" width="6" height="3" fill="currentColor" />
          <rect x="19" y="580" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 115 } as React.CSSProperties}>
          <rect x="12" y="585" width="3" height="3" fill="currentColor" />
          <rect x="16" y="585" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 116 } as React.CSSProperties}>
          <rect x="12" y="590" width="4" height="3" fill="currentColor" />
          <rect x="17" y="590" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 117 } as React.CSSProperties}>
          <rect x="12" y="595" width="3" height="3" fill="currentColor" />
          <rect x="16" y="595" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 118 } as React.CSSProperties}>
          <rect x="12" y="600" width="3" height="3" fill="currentColor" />
          <rect x="16" y="600" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 119 } as React.CSSProperties}>
          <rect x="12" y="605" width="5" height="3" fill="currentColor" />
          <rect x="18" y="605" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 120 } as React.CSSProperties}>
          <rect x="12" y="610" width="6" height="3" fill="currentColor" />
          <rect x="19" y="610" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 121 } as React.CSSProperties}>
          <rect x="12" y="615" width="3" height="3" fill="currentColor" />
          <rect x="16" y="615" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 122 } as React.CSSProperties}>
          <rect x="12" y="620" width="4" height="3" fill="currentColor" />
          <rect x="17" y="620" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 123 } as React.CSSProperties}>
          <rect x="12" y="625" width="3" height="3" fill="currentColor" />
          <rect x="16" y="625" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 124 } as React.CSSProperties}>
          <rect x="12" y="630" width="3" height="3" fill="currentColor" />
          <rect x="16" y="630" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 125 } as React.CSSProperties}>
          <rect x="12" y="635" width="5" height="3" fill="currentColor" />
          <rect x="18" y="635" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 126 } as React.CSSProperties}>
          <rect x="12" y="640" width="6" height="3" fill="currentColor" />
          <rect x="19" y="640" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 127 } as React.CSSProperties}>
          <rect x="12" y="645" width="3" height="3" fill="currentColor" />
          <rect x="16" y="645" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 128 } as React.CSSProperties}>
          <rect x="12" y="650" width="4" height="3" fill="currentColor" />
          <rect x="17" y="650" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 129 } as React.CSSProperties}>
          <rect x="12" y="655" width="3" height="3" fill="currentColor" />
          <rect x="16" y="655" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 130 } as React.CSSProperties}>
          <rect x="12" y="660" width="3" height="3" fill="currentColor" />
          <rect x="16" y="660" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 131 } as React.CSSProperties}>
          <rect x="12" y="665" width="5" height="3" fill="currentColor" />
          <rect x="18" y="665" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 132 } as React.CSSProperties}>
          <rect x="12" y="670" width="6" height="3" fill="currentColor" />
          <rect x="19" y="670" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 133 } as React.CSSProperties}>
          <rect x="12" y="675" width="3" height="3" fill="currentColor" />
          <rect x="16" y="675" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 134 } as React.CSSProperties}>
          <rect x="12" y="680" width="4" height="3" fill="currentColor" />
          <rect x="17" y="680" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 135 } as React.CSSProperties}>
          <rect x="12" y="685" width="3" height="3" fill="currentColor" />
          <rect x="16" y="685" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 136 } as React.CSSProperties}>
          <rect x="12" y="690" width="3" height="3" fill="currentColor" />
          <rect x="16" y="690" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 137 } as React.CSSProperties}>
          <rect x="12" y="695" width="5" height="3" fill="currentColor" />
          <rect x="18" y="695" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 138 } as React.CSSProperties}>
          <rect x="12" y="700" width="6" height="3" fill="currentColor" />
          <rect x="19" y="700" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 139 } as React.CSSProperties}>
          <rect x="12" y="705" width="3" height="3" fill="currentColor" />
          <rect x="16" y="705" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 140 } as React.CSSProperties}>
          <rect x="12" y="710" width="4" height="3" fill="currentColor" />
          <rect x="17" y="710" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 141 } as React.CSSProperties}>
          <rect x="12" y="715" width="3" height="3" fill="currentColor" />
          <rect x="16" y="715" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 142 } as React.CSSProperties}>
          <rect x="12" y="720" width="3" height="3" fill="currentColor" />
          <rect x="16" y="720" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 143 } as React.CSSProperties}>
          <rect x="12" y="725" width="5" height="3" fill="currentColor" />
          <rect x="18" y="725" width="2" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 144 } as React.CSSProperties}>
          <rect x="12" y="730" width="6" height="3" fill="currentColor" />
          <rect x="19" y="730" width="1" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 145 } as React.CSSProperties}>
          <rect x="12" y="735" width="3" height="3" fill="currentColor" />
          <rect x="16" y="735" width="4" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 146 } as React.CSSProperties}>
          <rect x="12" y="740" width="4" height="3" fill="currentColor" />
          <rect x="17" y="740" width="3" height="3" fill="currentColor" />
        </g>
        <g className="datastream-brick" style={{ '--brick-idx': 147 } as React.CSSProperties}>
          <rect x="12" y="745" width="3" height="3" fill="currentColor" />
          <rect x="16" y="745" width="4" height="3" fill="currentColor" />
        </g>
      </g>
      {/* Overlay for animation */}

    </svg>

  );
};