import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * useIdleTimer — 监听用户活动，空闲超时后触发"入梦模式"
 * 
 * 监听事件：mousemove, mousedown, keydown, touchstart, scroll, wheel
 * 超时时长：3 分钟 (180,000ms)
 * 
 * 当 BootScreen 活跃或已在入梦模式时，计时器自动暂停。
 */
const IDLE_TIMEOUT = 3 * 60 * 1000; // 3 minutes

export const useIdleTimer = () => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isDreamMode = useAppStore(state => state.isDreamMode);
    const isBootSequenceActive = useAppStore(state => state.isBootSequenceActive);
    const setDreamMode = useAppStore(state => state.setDreamMode);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        // Don't start timer if already in dream mode or boot screen is active
        if (isDreamMode || isBootSequenceActive) return;

        timerRef.current = setTimeout(() => {
            setDreamMode(true);
        }, IDLE_TIMEOUT);
    }, [isDreamMode, isBootSequenceActive, setDreamMode]);

    useEffect(() => {
        // Don't run idle detection during boot or dream mode
        if (isDreamMode || isBootSequenceActive) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }

        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'] as const;

        // Start initial timer
        resetTimer();

        // Reset on any user activity
        const handleActivity = () => resetTimer();
        events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [isDreamMode, isBootSequenceActive, resetTimer]);
};
