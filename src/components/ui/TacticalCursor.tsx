import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import clsx from 'clsx';


export const TacticalCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isClicking, setIsClicking] = useState(false);


    // 状态 ref，用于避免 react render loop 中断动画流畅性
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorOrder = useRef({ x: 0, y: 0 }); // 用于计算平滑跟随

    // 战术准星的四个角 Ref
    const tlRef = useRef<HTMLDivElement>(null);
    const trRef = useRef<HTMLDivElement>(null);
    const blRef = useRef<HTMLDivElement>(null);
    const brRef = useRef<HTMLDivElement>(null);

    // 中心点 Ref
    const centerRef = useRef<HTMLDivElement>(null);

    // 速度监测

    const lastMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Detect touch logic
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouch) {
            setIsActive(true);
            document.documentElement.classList.add('custom-cursor-active');
        }
        return () => {
            document.documentElement.classList.remove('custom-cursor-active');
        };
    }, []);

    // 核心动画循环 (RAF)
    useEffect(() => {
        if (!isActive) return;

        const cursor = cursorRef.current;
        const tl = tlRef.current;
        const tr = trRef.current;
        const bl = blRef.current;
        const br = brRef.current;

        if (!cursor || !tl || !tr || !bl || !br) return;

        // 初始设置
        gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 }); // 初始隐藏防止闪烁

        // 鼠标移动监听 (只负责更新坐标数据)
        const onMouseMove = (e: MouseEvent) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;

            // 第一次移动时显示光标
            if (cursor.style.opacity === '0') {
                gsap.to(cursor, { opacity: 1, duration: 0.2 });
            }
        };

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.closest('button') ||
                target.closest('a') ||
                (target.tagName === 'DIV' && target.onclick != null) ||
                target.getAttribute('role') === 'button' ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsHovering(!!isClickable);
        };

        // Click handlers
        const onMouseDown = () => setIsClicking(true);
        const onMouseUp = () => setIsClicking(false);

        // Visibility handlers
        const onMouseLeave = () => {
            if (cursor) gsap.set(cursor, { opacity: 0 });
        };
        const onMouseEnter = () => {
            if (cursor) gsap.set(cursor, { opacity: 1 });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        // RAF 动画循环 (这是流畅的关键)
        const render = () => {
            if (!cursor) return;

            // 1. 位置跟随：使用极小的 lerp 实现微平滑，或者直接 1.0 实现绝对跟手
            // 为了战术感，我们希望它绝对跟手 (lag = 0.15 比较舒服，既不粘滞又有重量感)
            const lerpFactor = 0.25;
            cursorOrder.current.x += (mousePos.current.x - cursorOrder.current.x) * lerpFactor;
            cursorOrder.current.y += (mousePos.current.y - cursorOrder.current.y) * lerpFactor;

            gsap.set(cursor, { x: cursorOrder.current.x, y: cursorOrder.current.y });

            // 2. 速度计算 (用于动态扩散)
            const deltaX = mousePos.current.x - lastMouse.current.x;
            const deltaY = mousePos.current.y - lastMouse.current.y;
            const velocity = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            lastMouse.current.x = mousePos.current.x;
            lastMouse.current.y = mousePos.current.y;

            // 3. 动态扩散逻辑：速度越快，扩散越大 (max spread 12px)
            // 如果 Hover，则强制收缩 (spread = 0)
            const spread = isHovering ? 0 : Math.min(velocity * 0.5, 12);

            // 四个角的动态位置
            // 默认基础偏移是 6px (形成一个 12x12 的空心)
            const baseOffset = isHovering ? 8 : 4;
            const currentOffset = baseOffset + spread;

            // 应用动画到四个角 (使用 gsap.set 保证高性能)
            // TL: -x, -y
            gsap.set(tl, { x: -currentOffset, y: -currentOffset });
            // TR: +x, -y
            gsap.set(tr, { x: currentOffset, y: -currentOffset });
            // BL: -x, +y
            gsap.set(bl, { x: -currentOffset, y: currentOffset });
            // BR: +x, +y
            gsap.set(br, { x: currentOffset, y: currentOffset });

            // 4. Hover 旋转动画
            // 如果 Hover，整个容器旋转；否则复位
            if (isHovering) {
                // 持续旋转在 CSS 中定义可能更稳，这里只控制状态类
            }

            requestAnimationFrame(render);
        };

        const rafId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
            cancelAnimationFrame(rafId);
        };
    }, [isActive, isHovering]); // 依赖 isHovering 重新绑定 RAF 可能有点重，优化一下

    if (!isActive) return null;

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 z-[100000] pointer-events-none mix-blend-difference"
            style={{ willChange: 'transform' }}
        >
            {/* 准星容器：Hover 时锁定颜色变化 */}
            <div className={clsx(
                "relative flex items-center justify-center transition-transform duration-100",
                isClicking && "scale-90"  // 点击时整体因为后坐力微缩
            )}>

                {/* 1. Top Left Corner */}
                <div ref={tlRef} className={clsx(
                    "absolute w-2 h-2 border-t-2 border-l-2 transition-colors duration-200",
                    isClicking ? "border-brand-highlight" : "border-brand-primary/80"
                )} />

                {/* 2. Top Right Corner */}
                <div ref={trRef} className={clsx(
                    "absolute w-2 h-2 border-t-2 border-r-2 transition-colors duration-200",
                    isClicking ? "border-brand-highlight" : "border-brand-primary/80"
                )} />

                {/* 3. Bottom Left Corner */}
                <div ref={blRef} className={clsx(
                    "absolute w-2 h-2 border-b-2 border-l-2 transition-colors duration-200",
                    isClicking ? "border-brand-highlight" : "border-brand-primary/80"
                )} />

                {/* 4. Bottom Right Corner */}
                <div ref={brRef} className={clsx(
                    "absolute w-2 h-2 border-b-2 border-r-2 transition-colors duration-200",
                    isClicking ? "border-brand-highlight" : "border-brand-primary/80"
                )} />

                {/* 5. Center Dot (Hover 时大小变化保留，但颜色不变，Click 时消失) */}
                <div ref={centerRef} className={clsx(
                    "absolute w-1 h-1 rounded-full transition-all duration-150",
                    isClicking ? "opacity-0 scale-0" :
                        isHovering ? "bg-brand-primary scale-110 opacity-100" : "bg-brand-primary scale-100 opacity-100"
                )} />

            </div>
        </div>
    );
};
