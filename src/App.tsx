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
import { AboutMePage } from './pages/AboutMePage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { ConnectionLine } from './components/about/ConnectionLine'
import { SettingsModal } from './components/ui/SettingsModal'
import { CyberDebugPanel } from './components/ui/debug'
import { useAppStore } from './store/useAppStore'
import { useProjectStore } from './store/useProjectStore'
import { LanguageProvider } from './i18n'
import { AnimatePresence } from 'framer-motion'
import { VisualEditing } from '@sanity/visual-editing/react'
import { useLiveMode } from './sanity/client'
import { SanityErrorBoundary } from './components/error/SanityErrorBoundary'

function App() {
  // Enable live mode for Sanity drafts
  useLiveMode({ allowStudioOrigin: 'http://localhost:3333' });

  const { isBootSequenceActive, setBootSequence, isAboutMeOpen, isSettingsOpen, debugMode, brandTheme } = useAppStore();
  const location = useLocation();

  // Simulate boot sequence completion and initialize theme
  useEffect(() => {
    // Initialize theme on first load
    document.documentElement.setAttribute('data-theme', brandTheme);

    // Start boot sequence
    const timer = setTimeout(() => {
      setBootSequence(false);
    }, 4500);

    // Fetch Content
    useProjectStore.getState().fetchProjects();

    return () => clearTimeout(timer);
  }, [setBootSequence, brandTheme]);

  if (isBootSequenceActive) {
    return (
      <LanguageProvider>
        <BootScreen onComplete={() => setBootSequence(false)} />
      </LanguageProvider>
    );
  }

  // Check if we are on a project detail page OR design system page
  const isDetailPage = location.pathname.startsWith('/projects/') && location.pathname.split('/').length > 2;
  const isDesignSystemPage = location.pathname === '/design-system';
  const isFullWidth = isDetailPage || isDesignSystemPage;

  return (
    <LanguageProvider>
      <div className="min-h-screen w-full overflow-hidden text-brand-primary font-sans selection:bg-brand-primary/30">
        <MainLayout footer={<Footer />}>
          {/* Dashboard Container - Grid System */}
          <div className="cyber-grid h-full items-stretch relative">

            {/* LEFT PROFILE COLUMN (static) - Hidden on Detail/FullWidth Page */}
            {!isFullWidth && <ProfileSidebar />}

            {/* CENTER MAIN GRID (dynamic) - Expands to full width on Detail/FullWidth Page */}
            <div className={`${isFullWidth ? 'col-span-12' : 'col-span-1 md:col-span-3 lg:col-span-8'} h-full relative overflow-hidden`}>
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
                  <Route path="/design-system" element={<DesignSystemPage />} />
                </Routes>
              </AnimatePresence>

              {/* About Me Modal - 覆盖在 main-mid 区域内 */}
              <AnimatePresence>
                {isAboutMeOpen && <AboutMePage />}
              </AnimatePresence>
            </div>

            {/* RIGHT EMPTY COLUMN (static) - Hidden on Detail/FullWidth Page */}
            {!isFullWidth && <StatusSidebar />}

          </div>

          {/* Connection Line - 最顶层渲染，确保线条不被容器裁剪 */}
          <ConnectionLine />
        </MainLayout>

        <AnimatePresence>
          {isSettingsOpen && <SettingsModal />}
        </AnimatePresence>

        {/* Debug Panel - Only visible in debug mode */}
        <AnimatePresence>
          {debugMode && <CyberDebugPanel />}
        </AnimatePresence>

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
    </LanguageProvider>
  )
}


export default App
