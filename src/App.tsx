import { useEffect } from 'react'
import { BootScreen } from './components/layout/BootScreen'
import { MainLayout } from './components/layout/MainLayout'
import { Footer } from './components/layout/Footer'
import { FeaturePanel } from './components/layout/FeaturePanel'
import { ProfileSidebar } from './components/layout/ProfileSidebar'
import { StatusSidebar } from './components/layout/StatusSidebar'
import { useAppStore } from './store/useAppStore'

function App() {
  const { isBootSequenceActive, setBootSequence } = useAppStore();

  // Simulate boot sequence completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootSequence(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, [setBootSequence]);

  return (
    <div className="bg-cyber-950 min-h-screen">
      {isBootSequenceActive ? (
        <BootScreen onComplete={() => setBootSequence(false)} />
      ) : (
        <MainLayout
          footer={<Footer />}
        >
          {/* Dashboard Container - Grid System */}
          <div className="cyber-grid h-full items-stretch relative">

            {/* LEFT PROFILE COLUMN (2/12) */}
            <ProfileSidebar />

            {/* CENTER MAIN GRID (8/12) */}
            <FeaturePanel />

            {/* RIGHT EMPTY COLUMN (2/12) */}
            <StatusSidebar />

          </div>
        </MainLayout>
      )
      }
    </div >
  )
}

export default App
