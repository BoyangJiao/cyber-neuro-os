import type { Project } from '../../data/projects';
import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { Animator, FrameCorners } from '@arwes/react';

interface ProjectCardProps {
    project: Project;
    isActive: boolean;
    onClick: () => void;
    angle: number; // Position angle on carousel (degrees)
    radius: number; // Distance from center (translateZ)
}

// 旋转动画时长为 0.8s，延迟大约 0.5-0.6s 后再变化 corner deco
const DECO_DELAY_MS = 500;

export const ProjectCard = ({
    project,
    isActive,
    onClick,
    angle,
    radius,
}: ProjectCardProps) => {
    // 延迟激活状态 - 用于 corner deco 的变化
    // 当 isActive 变为 true 时，延迟一段时间后 delayedActive 才变为 true
    // 这样 corner deco 会在卡片旋转接近完成时再变长变亮
    const [delayedActive, setDelayedActive] = useState(isActive);

    useEffect(() => {
        if (isActive) {
            // 激活时延迟变化
            const timer = setTimeout(() => {
                setDelayedActive(true);
            }, DECO_DELAY_MS);
            return () => clearTimeout(timer);
        } else {
            // 取消激活时立即变化（不延迟）
            setDelayedActive(false);
        }
    }, [isActive]);

    // Arwes FrameCorners CSS variables - 使用项目 color tokens
    // 使用 delayedActive 控制 corner deco 的样式
    const frameStyles = {
        '--arwes-frames-bg-color': 'transparent',  // 透明背景，让图片可见
        '--arwes-frames-line-color': delayedActive ? 'var(--color-cyan-600)' : 'var(--color-cyan-900)',
        '--arwes-frames-deco-color': delayedActive ? 'var(--color-cyan-400)' : 'var(--color-cyan-500)',
    } as CSSProperties;

    // strokeWidth 保持一致
    const strokeWidth = 2;

    return (
        <div
            onClick={onClick}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '400px',
                height: '240px',
                // Core 3D positioning: rotate to angle, then push outward
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                transformStyle: 'preserve-3d',
                cursor: 'pointer',
            }}
        >
            {/* Frame container with Arwes FrameCorners */}
            <Animator>
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        ...frameStyles,
                    }}
                >
                    {/* 方案 C: 双 FrameCorners + Opacity Fade */}
                    {/* Inactive 状态的短 corner deco - 淡出 */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: delayedActive ? 0 : 1,
                            transition: 'opacity 0s',
                            pointerEvents: 'none',
                            zIndex: 10,  // 确保在图片上方
                        }}
                    >
                        <FrameCorners
                            padding={0}
                            strokeWidth={strokeWidth}
                            cornerLength={12}
                        />
                    </div>

                    {/* Active 状态的长 corner deco - 淡入 + 辉光 */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: delayedActive ? 1 : 0,
                            transition: 'opacity 0.4s ease-out',
                            pointerEvents: 'none',
                            zIndex: 10,  // 确保在图片上方
                        }}
                    >
                        <FrameCorners
                            padding={0}
                            strokeWidth={strokeWidth}
                            cornerLength={24}
                            style={{
                                // 多层辉光效果 - 参考提供的 shadow 样式
                                filter: `
                                    drop-shadow(0 0 6px rgba(0, 255, 255, 0.4))
                                    drop-shadow(0 0 4px rgba(0, 255, 255, 0.35))
                                    drop-shadow(0 0 3px rgba(0, 255, 255, 0.3))
                                    drop-shadow(0 0 2px rgba(0, 255, 255, 0.25))
                                `,
                            }}
                        />
                    </div>

                    {/* 渐变色块背景 - 死亡搁浅风格 */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 0,
                            background: `
                                linear-gradient(135deg, 
                                    rgba(15, 23, 35, 1) 0%,
                                    rgba(25, 35, 50, 1) 30%,
                                    rgba(35, 45, 60, 1) 60%,
                                    rgba(20, 30, 45, 1) 100%
                                )
                            `,
                        }}
                    />

                    {/* Card Content Overlay */}
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: '24px',
                            gap: '24px',
                            zIndex: 1,
                            background: 'linear-gradient(90deg, rgba(6,18,26,0.9) 0%, rgba(6,18,26,0.5) 50%, transparent 100%)',
                        }}
                    >
                        {/* Left: Project Icon */}
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                background: 'rgba(0, 240, 255, 0.05)',
                                border: '1px solid rgba(0, 240, 255, 0.2)',
                                flexShrink: 0,
                            }}
                        >
                            <i
                                className={project.thumbnail}
                                style={{
                                    fontSize: '40px',
                                    color: isActive ? 'rgba(0, 240, 255, 1)' : 'rgba(0, 240, 255, 0.6)',
                                    filter: isActive ? 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.8))' : 'none',
                                    transition: 'color 0.3s, filter 0.3s',
                                }}
                            />
                        </div>

                        {/* Right: Text Content */}
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            {/* Project Title */}
                            <h3
                                style={{
                                    color: isActive ? '#00f0ff' : 'rgba(0, 240, 255, 0.7)',
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    letterSpacing: '2px',
                                    margin: 0,
                                    textShadow: isActive ? '0 0 10px rgba(0, 240, 255, 0.8)' : 'none',
                                    transition: 'color 0.3s, text-shadow 0.3s',
                                }}
                            >
                                {project.title}
                            </h3>

                            {/* Project Description */}
                            <p
                                style={{
                                    color: 'rgba(148, 163, 184, 0.8)',
                                    fontSize: '13px',
                                    margin: 0,
                                    lineHeight: 1.4,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {project.description}
                            </p>

                            {/* Status Badge */}
                            <div
                                style={{
                                    marginTop: '4px',
                                    padding: '3px 10px',
                                    fontSize: '10px',
                                    letterSpacing: '1px',
                                    borderRadius: '2px',
                                    background: getStatusColor(project.status).bg,
                                    color: getStatusColor(project.status).text,
                                    border: `1px solid ${getStatusColor(project.status).border}`,
                                    alignSelf: 'flex-start',
                                }}
                            >
                                {project.status.replace('_', ' ')}
                            </div>
                        </div>
                    </div>
                </div>
            </Animator >
        </div >
    );
};

// Helper to get status-based colors
const getStatusColor = (status: Project['status']) => {
    switch (status) {
        case 'DEPLOYED':
            return {
                bg: 'rgba(34, 197, 94, 0.2)',
                text: '#22c55e',
                border: 'rgba(34, 197, 94, 0.5)',
            };
        case 'IN_DEVELOPMENT':
            return {
                bg: 'rgba(251, 191, 36, 0.2)',
                text: '#fbbf24',
                border: 'rgba(251, 191, 36, 0.5)',
            };
        case 'CLASSIFIED':
            return {
                bg: 'rgba(239, 68, 68, 0.2)',
                text: '#ef4444',
                border: 'rgba(239, 68, 68, 0.5)',
            };
    }
};
