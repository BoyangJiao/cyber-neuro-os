import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { BootScreen } from './components/layout/BootScreen'
import { MainLayout } from './components/layout/MainLayout'
import { Footer } from './components/layout/Footer'
import { ProfileSidebar } from './components/layout/ProfileSidebar'
import { StatusSidebar } from './components/layout/StatusSidebar'
import { FeaturePanel } from './components/layout/FeaturePanel'
import { ProjectLanding } from './pages/ProjectLanding'
import { ProjectDetail } from './pages/ProjectDetail'
import { useAppStore } from './store/useAppStore'
import { useProjectStore } from './store/useProjectStore'
import { AnimatePresence } from 'framer-motion'
import { VisualEditing } from '@sanity/visual-editing/react'
import { SanityErrorBoundary } from './components/error/SanityErrorBoundary'

function App() {
  const { isBootSequenceActive, setBootSequence } = useAppStore();
  const location = useLocation();

  // Simulate boot sequence completion
  useEffect(() => {
    // Start boot sequence
    const timer = setTimeout(() => {
      setBootSequence(false);
    }, 4500);

    // Fetch Content
    useProjectStore.getState().fetchProjects();

    return () => clearTimeout(timer);
  }, [setBootSequence]);

  if (isBootSequenceActive) {
    return <BootScreen onComplete={() => setBootSequence(false)} />;
  }

  // Check if we are on a project detail page
  const isDetailPage = location.pathname.startsWith('/projects/') && location.pathname.split('/').length > 2;

  return (
    <div className="bg-cyber-950 min-h-screen w-full overflow-hidden text-cyan-500 font-sans selection:bg-cyan-500/30">
      <MainLayout footer={<Footer />}>
        {/* Dashboard Container - Grid System */}
        <div className="cyber-grid h-full items-stretch relative">

          {/* LEFT PROFILE COLUMN (static) - Hidden on Detail Page */}
          {!isDetailPage && <ProfileSidebar />}

          {/* CENTER MAIN GRID (dynamic) - Expands to full width on Detail Page */}
          <div className={`${isDetailPage ? 'col-span-12' : 'col-span-1 md:col-span-3 lg:col-span-8'} h-full relative overflow-hidden`}>
            <AnimatePresence mode='wait'>
              {/* 
                 Consolidated Routing:
                 If we are at /projects/:id, render ProjectDetail.
                 Else render Landing/Feature.
               */}
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<FeaturePanel />} />
                <Route path="/projects" element={<ProjectLanding />} />
                <Route path="/projects/:projectId" element={<ProjectDetail />} />
              </Routes>
            </AnimatePresence>
          </div>

          {/* RIGHT EMPTY COLUMN (static) - Hidden on Detail Page */}
          {!isDetailPage && <StatusSidebar />}

        </div>
      </MainLayout>
      {/* Visual Editing Overlay for Sanity Presentation */}
      {/* Only render when inside an iframe (Sanity Studio) to avoid UI clutter on main site */}
      {window.self !== window.top && (
        <div className="z-[9999] pointer-events-none fixed inset-0">
          <SanityErrorBoundary>
            <VisualEditing portal />
          </SanityErrorBoundary>
        </div>
      )}
    </div>
  )
}


export default App
