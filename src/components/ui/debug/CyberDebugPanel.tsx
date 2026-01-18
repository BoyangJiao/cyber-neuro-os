import { useState, useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { HoloFrame } from '../HoloFrame';
import { CyberButton } from '../CyberButton';
import { MotionDiv } from '../../motion/MotionWrappers';
import { AnimatePresence } from 'framer-motion';
import { GeometryTab } from './GeometryTab';
import { GlitchTab } from './GlitchTab';
import { CyberRgbTab } from './CyberRgbTab';

const MIN_WIDTH = 280;
const MIN_HEIGHT = 300;
const DEFAULT_WIDTH = 360;
const DEFAULT_HEIGHT = 520;

type TabType = 'geometry' | 'glitch' | 'cyberrgb';

/**
 * CyberDebugPanel - 可拖拽/缩放的赛博朋克风格调试面板
 * 
 * 模块化结构：
 * - GeometryTab: 几何体选择
 * - GlitchTab: Glitch 效果控制
 * - CyberRgbTab: Cyber RGB 效果控制
 */
export const CyberDebugPanel = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState<TabType>('glitch');
    const [saveFlash, setSaveFlash] = useState(false);

    const [position, setPosition] = useState({ x: window.innerWidth - DEFAULT_WIDTH - 20, y: 80 });
    const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
    const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const panelRef = useRef<HTMLDivElement>(null);

    const { saveGlitchSettings, saveCyberRgbSettings } = useAppStore();

    const handleSave = useCallback(() => {
        saveGlitchSettings();
        saveCyberRgbSettings();
        setSaveFlash(true);
        setTimeout(() => setSaveFlash(false), 800);
    }, [saveGlitchSettings, saveCyberRgbSettings]);

    const handleDragStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
    }, [position]);

    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        resizeStartRef.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height };
    }, [size]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const dx = e.clientX - dragStartRef.current.x;
                const dy = e.clientY - dragStartRef.current.y;
                setPosition({
                    x: Math.max(0, Math.min(window.innerWidth - size.width, dragStartRef.current.posX + dx)),
                    y: Math.max(0, Math.min(window.innerHeight - 50, dragStartRef.current.posY + dy)),
                });
            }
            if (isResizing) {
                const dx = e.clientX - resizeStartRef.current.x;
                const dy = e.clientY - resizeStartRef.current.y;
                setSize({
                    width: Math.max(MIN_WIDTH, resizeStartRef.current.width + dx),
                    height: Math.max(MIN_HEIGHT, resizeStartRef.current.height + dy),
                });
            }
        };
        const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, size.width]);

    const tabs: { key: TabType; label: string; icon: string }[] = [
        { key: 'geometry', label: 'GEO', icon: 'ri-shapes-line' },
        { key: 'cyberrgb', label: 'RGB', icon: 'ri-palette-line' },
        { key: 'glitch', label: 'GLITCH', icon: 'ri-flashlight-line' },
    ];

    return (
        <MotionDiv
            ref={panelRef}
            className="fixed z-[200]"
            style={{ left: position.x, top: position.y, width: size.width, cursor: isDragging ? 'grabbing' : 'default' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
        >
            <HoloFrame
                variant="lines"
                className="bg-neutral-950/95 backdrop-blur-md !p-0 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)]"
                active={true}
            >
                {/* Title Bar */}
                <div
                    onMouseDown={handleDragStart}
                    className="flex items-center justify-between px-3 py-2 border-b border-cyan-900/50 bg-gradient-to-r from-cyan-950/60 to-neutral-950/80 cursor-grab active:cursor-grabbing select-none"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse" />
                        <span className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase">DEBUG PANEL</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CyberButton
                            variant="ghost"
                            size="sm"
                            className="text-[10px] px-2 h-6 text-cyan-600 hover:text-cyan-400 border border-transparent hover:border-cyan-900/50"
                            onClick={() => window.location.href = '/design-system'}
                        >
                            SYS
                        </CyberButton>
                        <CyberButton
                            variant="ghost"
                            size="sm"
                            iconOnly
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-cyan-600 hover:text-cyan-400 !p-1"
                        >
                            <i className={`ri-${isCollapsed ? 'add' : 'subtract'}-line text-sm`} />
                        </CyberButton>
                    </div>
                </div>

                <AnimatePresence>
                    {!isCollapsed && (
                        <MotionDiv
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: size.height - 40, opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden flex flex-col"
                        >
                            {/* Tabs */}
                            <div className="flex border-b border-cyan-900/30 shrink-0">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveSection(tab.key)}
                                        className={`flex-1 py-1.5 text-[9px] font-semibold tracking-wider uppercase transition-all ${activeSection === tab.key
                                            ? 'text-cyan-300 bg-cyan-500/10 border-b border-cyan-500'
                                            : 'text-cyan-700 hover:text-cyan-500'
                                            }`}
                                    >
                                        <i className={`${tab.icon} mr-1`} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-transparent">
                                {activeSection === 'geometry' && <GeometryTab />}
                                {activeSection === 'cyberrgb' && <CyberRgbTab onSave={handleSave} saveFlash={saveFlash} />}
                                {activeSection === 'glitch' && <GlitchTab onSave={handleSave} saveFlash={saveFlash} />}
                            </div>

                            {/* Resize Handle */}
                            <div onMouseDown={handleResizeStart} className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group">
                                <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-cyan-600 group-hover:border-cyan-400 transition-colors" />
                            </div>
                        </MotionDiv>
                    )}
                </AnimatePresence>
            </HoloFrame>
        </MotionDiv>
    );
};
