import { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAppStore } from '../../store/useAppStore';

/**
 * ConnectionLine - GSAP 驱动的连接线动画
 * 
 * 动态计算从 Profile Avatar 到 About Me 标题闪光点的连接线路径
 * 支持响应式布局
 */
export const ConnectionLine = () => {
    const { isAboutMeOpen } = useAppStore();
    const lineRef = useRef<SVGPathElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pathD, setPathD] = useState('');
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });

    // 计算路径坐标
    const calculatePath = useCallback(() => {
        const avatarEl = document.getElementById('avatar-frame');
        const dotEl = document.getElementById('about-title-dot');

        if (!avatarEl || !dotEl) return { path: '', start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };

        const avatarRect = avatarEl.getBoundingClientRect();
        const dotRect = dotEl.getBoundingClientRect();

        // 起点: Avatar 右边缘垂直居中
        const startX = avatarRect.right;
        const startY = avatarRect.top + avatarRect.height / 2;

        // 终点: 闪光点中心
        const endX = dotRect.left + dotRect.width / 2;
        const endY = dotRect.top + dotRect.height / 2;

        // 中间转折点 - 先水平延伸一段，再垂直，最后水平到终点
        const midX = startX + 40; // 向右延伸 40px

        // 生成 SVG path
        const path = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;

        return {
            path,
            start: { x: startX, y: startY },
            end: { x: endX, y: endY }
        };
    }, []);

    // 当 About Me 打开时计算路径
    useEffect(() => {
        if (isAboutMeOpen) {
            // 延迟一帧确保 DOM 已更新
            requestAnimationFrame(() => {
                const result = calculatePath();
                setPathD(result.path);
                setStartPoint(result.start);
                setEndPoint(result.end);
            });
        } else {
            setPathD('');
        }
    }, [isAboutMeOpen, calculatePath]);

    // 监听窗口大小变化
    useEffect(() => {
        if (!isAboutMeOpen) return;

        const handleResize = () => {
            const result = calculatePath();
            setPathD(result.path);
            setStartPoint(result.start);
            setEndPoint(result.end);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isAboutMeOpen, calculatePath]);

    // GSAP 画线动画
    useGSAP(() => {
        if (!lineRef.current || !isAboutMeOpen || !pathD) return;

        const path = lineRef.current;
        const length = path.getTotalLength();

        // 设置初始状态 - 线条完全隐藏
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
        });

        // 画线动画
        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.1,
        });

    }, { dependencies: [isAboutMeOpen, pathD], scope: containerRef });

    if (!isAboutMeOpen || !pathD) return null;

    // 矩形点尺寸
    const dotSize = 4;

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100]"
        >
            <svg
                className="absolute top-0 left-0 w-full h-full"
                style={{ overflow: 'visible' }}
            >
                {/* 定义发光滤镜 */}
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* 连接线主体 - 使用主题色 cyan-600，降低透明度匹配 FrameLines */}
                <path
                    ref={lineRef}
                    d={pathD}
                    fill="none"
                    stroke="var(--color-brand-secondary)"
                    strokeWidth="1"
                    strokeOpacity="0.35"
                />

                {/* 起点矩形 - 呼吸效果，使用主题色 cyan-500 */}
                <rect
                    x={startPoint.x - dotSize / 2}
                    y={startPoint.y - dotSize / 2}
                    width={dotSize}
                    height={dotSize}
                    fill="var(--color-brand-primary)"
                    fillOpacity="0.9"
                    filter="url(#glow)"
                    className="animate-pulse"
                />

                {/* 终点矩形 - 呼吸效果，使用主题色 cyan-500 */}
                <rect
                    x={endPoint.x - dotSize / 2}
                    y={endPoint.y - dotSize / 2}
                    width={dotSize}
                    height={dotSize}
                    fill="var(--color-brand-primary)"
                    fillOpacity="0.9"
                    filter="url(#glow)"
                    className="animate-pulse"
                />
            </svg>
        </div>
    );
};
