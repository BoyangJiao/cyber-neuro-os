/**
 * Centralized Animation Utilities
 * 统一管理项目中的动效 class names
 * 对应的 @keyframes 定义在 src/index.css 中
 */

export const ANIMATIONS = {
    // Glitch Effects
    GLITCH: {
        GHOST: 'animate-[glitchGhost_0.3s_ease-in-out]',
        // 预留其他强度的 glitch
        // INTENSE: 'animate-[glitchIntense_0.5s_ease-in-out]',
        // SUBTLE: 'animate-[glitchSubtle_0.2s_ease-in-out]',
    },

    // UI Interactions
    HOVER: {
        SCALE_UP: 'hover:scale-[1.15] active:scale-100 transition-all duration-200',
        PULSE: 'hover:animate-pulse',
        // 预留发光增强等效果
        // GLOW: 'hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]',
    },

    // Transitions
    TRANSITION: {
        DEFAULT: 'transition-all duration-300 ease-out',
        FAST: 'transition-all duration-150 ease-out',
        SLOW: 'transition-all duration-500 ease-out',
    }
} as const;

// 组合动效辅助函数
export const combineAnimations = (...animations: (string | undefined | null | false)[]) => {
    return animations.filter(Boolean).join(' ');
};
