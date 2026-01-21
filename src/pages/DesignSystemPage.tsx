import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="h-full w-full bg-bg-app text-brand-primary font-sans p-8 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between mb-12 border-b border-border-subtle pb-6">
                <div className="flex items-center gap-6">
                    <CyberButton
                        variant="ghost"
                        iconOnly
                        className="w-12 h-12"
                        onClick={() => navigate('/')}
                    >
                        <i className="ri-arrow-left-line text-2xl" />
                    </CyberButton>
                    <div>
                        <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-wider mb-2">
                            CYBER NEURO SYSTEM
                        </h1>
                        <p className="text-cyan-600 text-sm tracking-[0.2em] uppercase">
                            Component Architecture & Visual Interface
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 border border-border-default rounded bg-brand-dim text-xs font-mono">
                        v2.0.0
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 max-w-[1920px] mx-auto pb-20">

                {/* ==================== BUTTONS SECTION ==================== */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-1 bg-brand-primary shadow-glow" />
                        <h2 className="text-2xl font-bold tracking-widest text-white">BUTTON COMPONENTS</h2>
                    </div>

                    {/* 1. NeuroButton (Dot Variant) */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-dashed border-border-subtle pb-2">
                            <h3 className="text-lg font-mono text-cyan-300">
                                {"<NeuroButton />"} / variant="dot"
                            </h3>
                            <span className="text-xs text-cyan-700">Digital / Data-Driven / Matrix</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-brand-dim rounded-xl border border-border-subtle relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.05)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-shine pointer-events-none" />

                            <div className="space-y-4">
                                <p className="text-xs text-cyan-600 uppercase mb-2">Direct Import</p>
                                <div className="flex flex-wrap gap-4">
                                    <NeuroButton>Verify Identity</NeuroButton>
                                    <NeuroButton iconOnly><i className="ri-fingerprint-line" /></NeuroButton>
                                    <NeuroButton disabled>Locked</NeuroButton>
                                </div>
                            </div>

                            {/* Facade Usage */}
                            <div className="space-y-4">
                                <p className="text-xs text-cyan-600 uppercase mb-2">Facade (CyberButton)</p>
                                <div className="flex flex-wrap gap-4">
                                    <CyberButton variant="dot">INIT_SYSTEM</CyberButton>
                                    <CyberButton variant="dot" className="w-full">Full Width Action</CyberButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. ChamferButton (Chamfer Variant) */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-dashed border-border-subtle pb-2">
                            <h3 className="text-lg font-mono text-cyan-300">
                                {"<ChamferButton />"} / variant="chamfer"
                            </h3>
                            <span className="text-xs text-cyan-700">Mechanical / Industrial / Strong</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-brand-dim rounded-xl border border-border-subtle">
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
                            <div className="flex flex-col justify-center items-center gap-4 border-l border-border-subtle pl-6">
                                <p className="text-xs text-center text-cyan-600">Supports custom sizing</p>
                                <ChamferButton className="h-16 text-xl tracking-[0.2em] w-full">
                                    DEPLOY
                                </ChamferButton>
                            </div>
                        </div>
                    </div>

                    {/* 3. CornerButton (Corner Variant) */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-dashed border-border-subtle pb-2">
                            <h3 className="text-lg font-mono text-cyan-300">
                                {"<CornerButton />"} / variant="corner"
                            </h3>
                            <span className="text-xs text-cyan-700">HUD / Tactical / Minimal</span>
                        </div>
                        <div className="p-8 bg-brand-dim rounded-xl border border-border-subtle flex flex-wrap gap-8 items-center justify-center">
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
                        <div className="flex justify-between items-end border-b border-dashed border-border-subtle pb-2">
                            <h3 className="text-lg font-mono text-cyan-300">
                                {"<GhostButton />"} / variant="ghost"
                            </h3>
                            <span className="text-xs text-cyan-700">Secondary / Navigation</span>
                        </div>
                        <div className="p-8 bg-brand-dim rounded-xl border border-border-subtle flex flex-wrap gap-6 items-center">
                            <GhostButton>Cancel Operation</GhostButton>
                            <GhostButton className="text-purple-400 hover:text-purple-200">
                                <i className="ri-magic-line mr-2" />
                                Magic Mode
                            </GhostButton>
                            <div className="h-12 w-[1px] bg-border-subtle" />
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
                        <h2 className="text-2xl font-bold tracking-widest text-white">FRAME COMPONENTS</h2>
                    </div>

                    {/* 1. CornerFrame (Avatar/Display) */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-dashed border-border-subtle pb-2">
                            <h3 className="text-lg font-mono text-purple-300">
                                {"<CornerFrame />"} / variant="corner"
                            </h3>
                            <span className="text-xs text-cyan-700 w-1/2 text-right">Interactive / Focus / Avatar</span>
                        </div>
                        {/* Interactive Playground */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="aspect-square relative flex items-center justify-center p-8 bg-black/40 rounded-xl overflow-hidden group">
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
                                        <div className="flex items-center justify-center h-full text-cyan-400 text-xs">Via HoloFrame Facade</div>
                                    </HoloFrame>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. DotsFrame (Modal/Window) */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-dashed border-border-subtle pb-2">
                            <h3 className="text-lg font-mono text-purple-300">
                                {"<DotsFrame />"} / variant="dots"
                            </h3>
                            <span className="text-xs text-cyan-700">Modal / Pop-up / Alert</span>
                        </div>
                        <div className="relative p-12 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                            <div className="relative w-full max-w-md h-48 flex flex-col">
                                <DotsFrame>
                                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-cyan-100">
                                        <i className="ri-lock-2-line text-3xl mb-2 text-cyan-400" />
                                        <h4 className="text-xl font-bold mb-1">SECURE TERMINAL</h4>
                                        <p className="text-xs text-cyan-400/60">Biometric Scan Required</p>
                                    </div>
                                </DotsFrame>
                            </div>
                        </div>
                    </div>

                    {/* 3. Lines & Chamfer Frames */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-dashed border-border-subtle pb-2">
                                <h3 className="text-lg font-mono text-purple-300">LinesFrame</h3>
                            </div>
                            <div className="h-40 relative">
                                <LinesFrame>
                                    <div className="h-full flex items-center justify-center text-cyan-700 font-mono text-sm">
                                        Standard Data Container
                                    </div>
                                </LinesFrame>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-dashed border-border-subtle pb-2">
                                <h3 className="text-lg font-mono text-purple-300">ChamferFrame</h3>
                            </div>
                            <div className="h-40 relative">
                                <ChamferFrame>
                                    <div className="h-full flex items-center justify-center bg-cyan-950/20 text-cyan-400 font-display tracking-widest">
                                        HARDWARE STATUS
                                    </div>
                                </ChamferFrame>
                            </div>
                        </div>
                    </div>

                    {/* 4. Complex Interactions */}
                    <div className="mt-12 space-y-6">
                        <div className="flex justify-between items-end border-b border-dashed border-border-subtle pb-2">
                            <h3 className="text-lg font-mono text-white">
                                Complex Components
                            </h3>
                            <span className="text-xs text-cyan-700">Combined Behaviors</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <HoloTiltCard
                                title="Project Alpha"
                                icon="ri-stack-line"
                                className="h-64 border border-cyan-800/30 bg-black/40"
                                content3d={
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-6xl font-black text-cyan-800/20 select-none">01</div>
                                    </div>
                                }
                            />
                            <HoloTiltCard
                                title="System Core"
                                icon="ri-cpu-line"
                                className="h-64 border border-cyan-800/30 bg-black/40"
                                content3d={
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-20 h-20 border-4 border-cyan-500/20 rounded-full flex items-center justify-center">
                                            <div className="w-12 h-12 bg-cyan-500/40 rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                }
                            />
                            <HoloTiltCard
                                title="Network"
                                icon="ri-global-line"
                                className="h-64 border border-cyan-800/30 bg-black/40"
                                content3d={
                                    <div className="w-full h-full flex flex-col justify-between p-8 no-rotate">
                                        <div className="h-1 w-full bg-cyan-900/50 overflow-hidden">
                                            <div className="h-full w-1/2 bg-cyan-500 animate-[scan_2s_linear_infinite]" />
                                        </div>
                                        <div className="text-right font-mono text-xs text-cyan-400">CONNECTING...</div>
                                    </div>
                                }
                            />
                        </div>
                    </div>

                </section>
            </div>
        </div>
    );
};
