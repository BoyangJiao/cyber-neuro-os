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
    }, 4500); // slightly longer than the boot animation total time
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {bootSequence ? (
        <BootScreen onComplete={() => setBootSequence(false)} />
      ) : (
        <MainLayout>
          {/* Main Content Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

            {/* Left Column: Quick Actions */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <HoloFrame type="corner" className="p-6 h-full min-h-[300px]">
                <h2 className="text-xl font-display font-bold mb-4 tracking-wider text-cyan-200">
                  <span className="text-cyan-600 mr-2">01</span>
                  SYSTEM CONTROL
                </h2>
                <CyberLine variant="surface" className="mb-6 opacity-30" />

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-mono text-cyan-500/50">PRIMARY PROTOCOLS</span>
                    <CyberButton variant="corner" className="w-full" onClick={() => alert('INITIATED')}>
                      INITIATE LINK
                    </CyberButton>
                    <CyberButton variant="chamfer" className="w-full" onClick={() => alert('SCANNING')}>
                      SYSTEM SCAN
                    </CyberButton>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <span className="text-xs font-mono text-cyan-500/50">CONNECTION STATUS</span>
                    <div className="flex flex-col gap-4 items-center">
                      {/* Dot variant (Strand) showing custom hover animation */}
                      <CyberButton variant="dot" size="lg" className="w-full" onClick={() => alert('CONNECTING...')}>
                        CONNECT
                      </CyberButton>
                    </div>
                  </div>
                </div>
              </HoloFrame>
            </div>

            {/* Right Column: Data Visualization */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              <HoloFrame type="outline" className="h-full p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <CyberButton variant="ghost" size="sm" icon={<span className="text-lg">⚙</span>} />
                </div>

                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-2xl font-display font-bold tracking-widest text-cyan-100">
                    NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-transparent">DAEMON</span>
                  </h2>
                </div>
                <CyberLine variant="hud" className="mb-8" />

                <div className="grid grid-cols-2 gap-8 h-[300px] border border-cyan-900/30 bg-cyber-900/10 p-4">
                  <div className="flex items-center justify-center text-cyan-500/30 font-mono text-sm">
                    [DATA STREAM INACTIVE]
                  </div>
                  <div className="flex items-center justify-center text-cyan-500/30 font-mono text-sm border-l border-cyan-900/30">
                    [SIGNAL LOSS]
                  </div>
                </div>
              </HoloFrame>
            </div>

          </div>
        </MainLayout>
      )}
    </>
  )
}

export default App
