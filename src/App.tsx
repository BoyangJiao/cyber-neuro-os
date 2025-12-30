import { useState, useEffect } from 'react'
import { BootScreen } from './components/layout/BootScreen'
import { MainLayout } from './components/layout/MainLayout'
import { CyberButton } from './components/ui/CyberButton'
import { HoloFrame } from './components/ui/HoloFrame'
import { CyberLine } from './components/ui/CyberLine'

function App() {
  const [bootSequence, setBootSequence] = useState(true);

  // Simulate boot sequence completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootSequence(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-cyber-950 min-h-screen">
      {bootSequence ? (
        <BootScreen onComplete={() => setBootSequence(false)} />
      ) : (
        <MainLayout
          footer={
            <div className="w-full h-full flex items-center justify-between">
              {/* Footer Left: Neural Uplink */}
              <div className="flex items-center gap-4">
                <CyberButton variant="corner" size="lg" className="min-w-[240px] flex items-center gap-3">
                  <span>NEURAL UPLINK</span>
                  <i className="ri-share-forward-line"></i>
                </CyberButton>
              </div>

              {/* Footer Right: Settings & Equalizer */}
              <div className="flex items-center gap-6">
                <CyberButton variant="ghost" className="text-cyan-400 hover:text-cyan-200 border-none group">
                  <span className="mr-2 group-hover:text-cyan-100 transition-colors">VISUAL SETTINGS</span>
                  <i className="ri-settings-3-line animate-spin-slow text-cyan-500 group-hover:text-cyan-300"></i>
                </CyberButton>
                <div className="w-[1px] h-8 bg-cyan-800/50"></div>
                <CyberButton variant="ghost" className="w-12 h-12 p-0 flex items-center justify-center text-cyan-500 hover:text-cyan-300">
                  <i className="ri-equalizer-line text-2xl"></i>
                </CyberButton>
              </div>
            </div>
          }
        >
          {/* Dashboard Container - Full Height */}
          <div className="flex flex-col lg:flex-row gap-12 h-full items-stretch relative">

            {/* LEFT PROFILE COLUMN */}
            <div className="w-full lg:w-[280px] flex flex-col gap-8 shrink-0 py-4">
              {/* Profile Photo Frame */}
              <HoloFrame variant="corner" className="aspect-[3/4] w-full bg-cyan-950/30 flex items-center justify-center group overflow-hidden relative">
                {/* Placeholder Avatar / Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                <i className="ri-user-3-line text-6xl text-cyan-500/20 group-hover:text-cyan-400/50 transition-colors duration-500"></i>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
              </HoloFrame>

              {/* Profile Details */}
              <div className="flex flex-col gap-6 pl-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-cyan-700 tracking-widest uppercase">NAME</span>
                  <div className="text-xl font-display font-bold text-cyan-50 tracking-wider">BOYANG JIAO</div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-cyan-700 tracking-widest uppercase">OCCUPATION</span>
                  <div className="text-sm font-mono text-cyan-300 tracking-wide">DESIGNER & BUILDER</div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-cyan-700 tracking-widest uppercase">CORPORATION</span>
                  <div className="text-sm font-mono text-cyan-300 tracking-wide">ANT GROUP</div>
                </div>
              </div>
            </div>

            {/* RIGHT MAIN GRID */}
            <div className="flex-1 flex flex-col h-full py-2">
              {/* Menu Grid - Centered vertically in available space */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr h-full">
                {[
                  { title: 'PROJECT', icon: 'ri-rocket-2-line', color: 'text-cyan-400' },
                  { title: 'VIDEO', icon: 'ri-movie-2-line', color: 'text-cyan-400' },
                  { title: 'GAME', icon: 'ri-gamepad-line', color: 'text-cyan-400' },
                  { title: 'SOUND', icon: 'ri-voiceprint-line', color: 'text-cyan-400' },
                  { title: 'MUSIC', icon: 'ri-music-2-line', color: 'text-cyan-400' },
                  { title: 'LAB', icon: 'ri-flask-line', color: 'text-cyan-400' },
                ].map((item) => (
                  <HoloFrame
                    key={item.title}
                    variant="lines"
                    className="group relative flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-cyan-900/10 transition-colors duration-300 bg-cyan-950/20"
                  >
                    <div className="absolute top-6 font-mono text-sm tracking-[0.2em] text-cyan-100 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </div>
                    <i className={`${item.icon} text-6xl ${item.color} opacity-60 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-300 ease-out`}></i>

                    {/* Decorative Corners for selected feel */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/30 group-hover:border-cyan-400 transition-colors"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/30 group-hover:border-cyan-400 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/30 group-hover:border-cyan-400 transition-colors"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/30 group-hover:border-cyan-400 transition-colors"></div>
                  </HoloFrame>
                ))}
              </div>
            </div>

          </div>
        </MainLayout>
      )}
    </div>
  )
}

export default App
