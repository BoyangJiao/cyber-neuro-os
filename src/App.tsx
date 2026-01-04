import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { BootScreen } from './components/layout/BootScreen'
import { MainLayout } from './components/layout/MainLayout'
import { Footer } from './components/layout/Footer'
import { ProfileSidebar } from './components/layout/ProfileSidebar'
import { StatusSidebar } from './components/layout/StatusSidebar'
import { FeaturePanel } from './components/layout/FeaturePanel'
import { ProjectLanding } from './pages/ProjectLanding'
import { useAppStore } from './store/useAppStore'
import { AnimatePresence } from 'framer-motion'

function App() {
  const { isBootSequenceActive, setBootSequence } = useAppStore();
  const location = useLocation();

  // Simulate boot sequence completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootSequence(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, [setBootSequence]);

  if (isBootSequenceActive) {
    return <BootScreen onComplete={() => setBootSequence(false)} />;
  }

  return (
    <div className="bg-cyber-950 min-h-screen w-full overflow-hidden text-cyan-500 font-sans selection:bg-cyan-500/30">
      <MainLayout footer={<Footer />}>
        {/* Dashboard Container - Grid System */}
        <div className="cyber-grid h-full items-stretch relative">

          {/* LEFT PROFILE COLUMN (static) */}
          <ProfileSidebar />

          {/* CENTER MAIN GRID (dynamic) */}
          <div className="col-span-1 md:col-span-3 lg:col-span-8 h-full relative overflow-hidden">
            <AnimatePresence>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<FeaturePanel />} />
                <Route path="/projects" element={<ProjectLanding />} />
              </Routes>
            </AnimatePresence>
          </div>

          {/* RIGHT EMPTY COLUMN (static) */}
          <StatusSidebar />

        </div>
      </MainLayout>
    </div>
  )
}

export default App
