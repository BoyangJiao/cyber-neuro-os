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
import { MusicPage } from './pages/MusicPage'
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
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { GlobalAudioPlayer } from './components/audio/GlobalAudioPlayer'
import { Agentation } from 'agentation'
import { TacticalCursor } from './components/ui/TacticalCursor'

function App() {
  // Enable live mode for Sanity drafts
  useLiveMode({ allowStudioOrigin: 'http://localhost:3333' });

  const { isBootSequenceActive, setBootSequence, isAboutMeOpen, isSettingsOpen, debugMode, brandTheme } = useAppStore();
  const location = useLocation();

  // Simulate boot sequence completion and initialize theme
  useEffect(() => {
    // Initialize theme on first load
    document.documentElement.setAttribute('data-theme', brandTheme);

    // Fetch Content
    useProjectStore.getState().fetchProjects();

  }, [brandTheme]);

  if (isBootSequenceActive) {
    return (
      <LanguageProvider>
        <BootScreen onComplete={() => setBootSequence(false)} />
      </LanguageProvider>
    );
  }

  // Check if we're on a project detail page (for full-screen overlay)
  const isDetailPage = location.pathname.startsWith('/projects/') && location.pathname.split('/').length > 2;

  // Check if we are on a design system page (needs full width in grid)
  const isDesignSystemPage = location.pathname === '/design-system';
  const isFullWidth = isDesignSystemPage;

  return (
    <LanguageProvider>
      {/* Dev-only Annotation Tool */}
      {import.meta.env.DEV && (
        <div className="fixed z-[9999] pointer-events-none *:pointer-events-auto">
          <Agentation />
        </div>
      )}

      <div className="min-h-screen w-full overflow-hidden text-brand-primary font-sans selection:bg-brand-primary/30">
        <MainLayout footer={<Footer />}>
          {/* Dashboard Container - Flexible Layout (Fixed Sides, Fluid Center) */}
          <div className="flex h-full w-full relative overflow-hidden gap-4 lg:gap-6 2xl:gap-8">

            {/* LEFT PROFILE COLUMN (Fixed width, sticky behavior) */}
            {!isFullWidth && (
              <aside className="hidden lg:flex flex-none flex-col h-full z-30 relative">
                <ProfileSidebar />
              </aside>
            )}

            {/* CENTER MAIN CONTENT (Fluid width, takes remaining space) */}
            <main className={`flex-1 h-full relative min-w-0 flex flex-col z-10 transition-all duration-300 ${isFullWidth ? 'w-full' : ''}`}>
              <div className="w-full h-full relative overflow-hidden py-3 lg:py-4 max-w-[1600px] mx-auto">
                {/* Routes without key - prevents unnecessary re-mounting */}
                <Routes location={location}>
                  <Route path="/" element={<FeaturePanel />} />
                  <Route path="/projects/*" element={<ProjectLanding />} />
                  <Route path="/design-system" element={<DesignSystemPage />} />
                  <Route path="/music" element={<MusicPage />} />
                </Routes>

                {/* About Me Modal - 覆盖在 main-mid 区域内 */}
                <AnimatePresence>
                  {isAboutMeOpen && <AboutMePage />}
                </AnimatePresence>
              </div>
            </main>

            {/* RIGHT STATUS COLUMN (Fixed width, sticky behavior) */}
            {!isFullWidth && (
              <aside className="hidden lg:flex flex-none flex-col h-full z-30 relative pointer-events-none">
                <StatusSidebar />
              </aside>
            )}

          </div>

          {/* Connection Line - 最顶层渲染，确保线条不被容器裁剪 */}
          <ConnectionLine />
        </MainLayout>

        {/* ProjectDetail - Full Screen Overlay (completely independent of routing) */}
        <AnimatePresence>
          {isDetailPage && <ProjectDetail />}
        </AnimatePresence>

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

      {/* Shared Three.js Canvas for View Portals */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas
          eventSource={document.getElementById('root')!}
          className="pointer-events-none"
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.5]}
        >
          <View.Port />
        </Canvas>
      </div>
      <GlobalAudioPlayer />

      {/* Tactical HUD Cursor - Topmost Layer */}
      <TacticalCursor />
    </LanguageProvider>
  )
}


export default App
