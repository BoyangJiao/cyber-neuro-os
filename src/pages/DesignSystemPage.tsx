import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MotionDiv } from '../components/motion/MotionWrappers';

// Buttons
import { CyberButton } from '../components/ui/CyberButton';
import { NeuroButton } from '../components/ui/buttons/NeuroButton';
import { ChamferButton } from '../components/ui/buttons/ChamferButton';
import { GhostButton } from '../components/ui/buttons/GhostButton';
import { CornerButton } from '../components/ui/buttons/CornerButton';

// Frames
import { HoloFrame } from '../components/ui/HoloFrame';
import { CornerFrame } from '../components/ui/frames/CornerFrame';
import { LinesFrame } from '../components/ui/frames/LinesFrame';
import { ChamferFrame } from '../components/ui/frames/ChamferFrame';
import { DotsFrame } from '../components/ui/frames/DotsFrame';
import { HoloTiltCard } from '../components/ui/HoloTiltCard';

export const DesignSystemPage = () => {
    const navigate = useNavigate();
    const [testPressed, setTestPressed] = useState(false);

    return (
        <MotionDiv
            className="absolute top-0 left-0 w-full h-full z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.3, ease: "circOut" }}
        >
            <HoloFrame
                variant="lines"
                className="w-full h-full bg-[var(--color-bg-app)] relative overflow-hidden p-0"
                showAtmosphere={true}
                showMask={true}
            >
                {/* Main Container - Vertical Flex */}
                <div className="w-full h-full flex flex-col">

                    {/* === HEADER === */}
                    <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-1 2xl:px-2 pt-1 2xl:pt-1 pb-1 2xl:pb-1">
                        {/* Left Placeholder */}
                        <div className="w-16 2xl:w-20" />

                        {/* Center Title */}
                        <div className="flex flex-col items-center">
                            <h1 className="text-sm 2xl:text-lg font-bold text-brand-secondary tracking-[0.3em] uppercase">
                                SYSTEM COMPONENTS
                            </h1>
                        </div>

                        {/* Right Close Button */}
                        <div className="flex justify-end w-16 2xl:w-20">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-close-line text-xl 2xl:text-2xl" />}
                                onClick={() => navigate('/')}
                                className="text-brand-primary hover:text-brand-secondary transition-colors"
                                iconOnly
                            />
                        </div>
                    </div>

                    {/* === MAIN CONTENT === */}
                    <div className="flex-1 w-full min-h-0 px-4 2xl:px-6 pb-4 2xl:pb-6 relative z-10 overflow-y-auto custom-scrollbar">
                        <div className="max-w-[1920px] mx-auto py-8">

                            <div className="flex items-center justify-between mb-12 border-b border-brand-primary/20 pb-6">
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary tracking-wider mb-2">
                                        CYBER NEURO SYSTEM
                                    </h2>
                                    <p className="text-brand-secondary text-xs tracking-[0.2em] uppercase">
                                        Component Architecture & Visual Interface v2.0.0
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 pb-20">
                                {/* ==================== BUTTONS SECTION ==================== */}
                                <section className="space-y-12">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-10 w-1 bg-brand-primary shadow-brand-glow" />
                                        <h2 className="text-xl font-bold tracking-widest text-white">BUTTON COMPONENTS</h2>
                                    </div>

                                    {/* 1. NeuroButton (Dot Variant) */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end border-b border-dashed border-brand-primary/30 pb-2">
                                            <h3 className="text-lg font-mono text-brand-secondary">
                                                {"<NeuroButton />"} / variant="dot"
                                            </h3>
                                            <span className="text-xs text-brand-primary/70">Digital / Data-Driven / Matrix</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-brand-primary/5 rounded-xl border border-brand-primary/20 relative overflow-hidden group">
                                            <div className="space-y-4">
                                                <p className="text-xs text-brand-primary uppercase mb-2">Direct Import</p>
                                                <div className="flex flex-wrap gap-4">
                                                    <NeuroButton>Verify Identity</NeuroButton>
                                                    <NeuroButton iconOnly><i className="ri-fingerprint-line" /></NeuroButton>
                                                    <NeuroButton disabled>Locked</NeuroButton>
                                                </div>
                                            </div>

                                            {/* Facade Usage */}
                                            <div className="space-y-4">
                                                <p className="text-xs text-brand-primary uppercase mb-2">Facade (CyberButton)</p>
                                                <div className="flex flex-wrap gap-4">
                                                    <CyberButton variant="dot">INIT_SYSTEM</CyberButton>
                                                    <CyberButton variant="dot" className="w-full">Full Width Action</CyberButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. ChamferButton (Chamfer Variant) */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end border-b border-dashed border-brand-primary/30 pb-2">
                                            <h3 className="text-lg font-mono text-brand-secondary">
                                                {"<ChamferButton />"} / variant="chamfer"
                                            </h3>
                                            <span className="text-xs text-brand-primary/70">Mechanical / Industrial / Strong</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
                                            <div className="flex flex-col gap-4">
                                                <ChamferButton>Cyan Default</ChamferButton>
                                                <ChamferButton color="green">Green (Cyber)</ChamferButton>
                                                <div className="flex gap-4">
                                                    <ChamferButton color="green" iconOnly>
                                                        <i className="ri-check-line" />
                                                    </ChamferButton>
                                                    <ChamferButton color="green" className="flex-1">Approved</ChamferButton>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center items-center gap-4 border-l border-brand-primary/20 pl-6">
                                                <p className="text-xs text-center text-brand-primary">Supports custom sizing</p>
                                                <ChamferButton className="h-16 text-xl tracking-[0.2em] w-full">
                                                    DEPLOY
                                                </ChamferButton>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. CornerButton (Corner Variant) */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end border-b border-dashed border-brand-primary/30 pb-2">
                                            <h3 className="text-lg font-mono text-brand-secondary">
                                                {"<CornerButton />"} / variant="corner"
                                            </h3>
                                            <span className="text-xs text-brand-primary/70">HUD / Tactical / Minimal</span>
                                        </div>
                                        <div className="p-8 bg-brand-primary/5 rounded-xl border border-brand-primary/20 flex flex-wrap gap-8 items-center justify-center">
                                            <CornerButton>
                                                <span className="mr-8">NAVIGATION</span>
                                                <i className="ri-arrow-right-line" />
                                            </CornerButton>

                                            <CornerButton iconOnly className="w-16 h-16">
                                                <i className="ri-radar-line text-2xl" />
                                            </CornerButton>

                                            <CyberButton variant="corner" className="text-red-400 hover:text-red-300">
                                                SELF DESTRUCT
                                            </CyberButton>
                                        </div>
                                    </div>

                                    {/* 4. GhostButton */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end border-b border-dashed border-brand-primary/30 pb-2">
                                            <h3 className="text-lg font-mono text-brand-secondary">
                                                {"<GhostButton />"} / variant="ghost"
                                            </h3>
                                            <span className="text-xs text-brand-primary/70">Secondary / Navigation</span>
                                        </div>
                                        <div className="p-8 bg-brand-primary/5 rounded-xl border border-brand-primary/20 flex flex-wrap gap-6 items-center">
                                            <GhostButton>Cancel Operation</GhostButton>
                                            <GhostButton className="text-purple-400 hover:text-purple-200">
                                                <i className="ri-magic-line mr-2" />
                                                Magic Mode
                                            </GhostButton>
                                            <div className="h-12 w-[1px] bg-brand-primary/20" />
                                            <CyberButton variant="ghost" iconOnly>
                                                <i className="ri-more-2-fill" />
                                            </CyberButton>
                                        </div>
                                    </div>
                                </section>


                                {/* ==================== FRAMES SECTION ==================== */}
                                <section className="space-y-12">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-10 w-1 bg-purple-500 shadow-[0_0_10px_purple]" />
                                        <h2 className="text-xl font-bold tracking-widest text-white">FRAME COMPONENTS</h2>
                                    </div>

                                    {/* 1. CornerFrame (Avatar/Display) */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end border-b border-dashed border-brand-primary/30 pb-2">
                                            <h3 className="text-lg font-mono text-purple-300">
                                                {"<CornerFrame />"} / variant="corner"
                                            </h3>
                                            <span className="text-xs text-brand-primary/70 w-1/2 text-right">Interactive / Focus / Avatar</span>
                                        </div>
                                        {/* Interactive Playground */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="aspect-square relative flex items-center justify-center p-8 bg-black/40 rounded-xl overflow-hidden group border border-white/5">
                                                <CornerFrame
                                                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                                                    isPressed={testPressed}
                                                >
                                                    <div
                                                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer z-30"
                                                        onMouseDown={() => setTestPressed(true)}
                                                        onMouseUp={() => setTestPressed(false)}
                                                        onMouseLeave={() => setTestPressed(false)}
                                                    >
                                                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 mb-4 animate-pulse" />
                                                        <span className="text-xs tracking-[0.3em]">INTERACTIVE</span>
                                                    </div>
                                                </CornerFrame>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="h-24 relative p-4">
                                                    <CornerFrame cornerSize={20} strokeWidth={1} color="rgba(255,0,255,0.5)">
                                                        <div className="flex items-center justify-center h-full text-purple-400 text-xs">Custom Color & Size</div>
                                                    </CornerFrame>
                                                </div>
                                                <div className="h-24 relative p-4">
                                                    <HoloFrame variant="corner" className="p-0">
                                                        <div className="flex items-center justify-center h-full text-brand-secondary text-xs">Via HoloFrame Facade</div>
                                                    </HoloFrame>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. DotsFrame (Modal/Window) */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end border-b border-dashed border-brand-primary/30 pb-2">
                                            <h3 className="text-lg font-mono text-purple-300">
                                                {"<DotsFrame />"} / variant="dots"
                                            </h3>
                                            <span className="text-xs text-brand-primary/70">Modal / Pop-up / Alert</span>
                                        </div>
                                        <div className="relative p-12 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center border border-white/5">
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                                            <div className="relative w-full max-w-md h-48 flex flex-col min-w-[320px]">
                                                <DotsFrame>
                                                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-brand-primary/20">
                                                        <i className="ri-lock-2-line text-3xl mb-2 text-brand-secondary" />
                                                        <h4 className="text-xl font-bold mb-1 text-white">SECURE TERMINAL</h4>
                                                        <p className="text-xs text-brand-secondary/60">Biometric Scan Required</p>
                                                    </div>
                                                </DotsFrame>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Lines & Chamfer Frames */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end border-b border-dashed border-brand-primary/30 pb-2">
                                                <h3 className="text-lg font-mono text-purple-300">LinesFrame</h3>
                                            </div>
                                            <div className="h-40 relative">
                                                <LinesFrame>
                                                    <div className="h-full flex items-center justify-center text-brand-primary font-mono text-sm">
                                                        Standard Data Container
                                                    </div>
                                                </LinesFrame>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end border-b border-dashed border-brand-primary/30 pb-2">
                                                <h3 className="text-lg font-mono text-purple-300">ChamferFrame</h3>
                                            </div>
                                            <div className="h-40 relative">
                                                <ChamferFrame>
                                                    <div className="h-full flex items-center justify-center bg-brand-primary/5 text-brand-secondary font-display tracking-widest">
                                                        HARDWARE STATUS
                                                    </div>
                                                </ChamferFrame>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Complex Interactions */}
                                    <div className="mt-12 space-y-6">
                                        <div className="flex justify-between items-end border-b border-dashed border-brand-primary/30 pb-2">
                                            <h3 className="text-lg font-mono text-white">
                                                Complex Components
                                            </h3>
                                            <span className="text-xs text-brand-primary/70">Combined Behaviors</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <HoloTiltCard
                                                title="Project Alpha"
                                                icon="ri-stack-line"
                                                className="h-64 border border-brand-primary/20 bg-black/40"
                                                content3d={
                                                    <div className="flex items-center justify-center h-full">
                                                        <div className="text-6xl font-black text-brand-primary/10 select-none">01</div>
                                                    </div>
                                                }
                                            />
                                            <HoloTiltCard
                                                title="System Core"
                                                icon="ri-cpu-line"
                                                className="h-64 border border-brand-primary/20 bg-black/40"
                                                content3d={
                                                    <div className="flex items-center justify-center h-full">
                                                        <div className="w-20 h-20 border-4 border-brand-secondary/20 rounded-full flex items-center justify-center">
                                                            <div className="w-12 h-12 bg-brand-secondary/40 rounded-full animate-pulse" />
                                                        </div>
                                                    </div>
                                                }
                                            />
                                            <HoloTiltCard
                                                title="Network"
                                                icon="ri-global-line"
                                                className="h-64 border border-brand-primary/20 bg-black/40"
                                                content3d={
                                                    <div className="w-full h-full flex flex-col justify-between p-8 no-rotate">
                                                        <div className="h-1 w-full bg-brand-primary/30 overflow-hidden">
                                                            <div className="h-full w-1/2 bg-brand-secondary animate-[scan_2s_linear_infinite]" />
                                                        </div>
                                                        <div className="text-right font-mono text-xs text-brand-secondary">CONNECTING...</div>
                                                    </div>
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </HoloFrame>
        </MotionDiv>
    );
};
