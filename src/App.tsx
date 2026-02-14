import { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation, matchPath } from 'react-router-dom'
import { BootScreen } from './components/layout/BootScreen'
import { MainLayout } from './components/layout/MainLayout'
import { Footer } from './components/layout/Footer'
import { ProfileSidebar } from './components/layout/ProfileSidebar'
import { StatusSidebar } from './components/layout/StatusSidebar'
import { FeaturePanel } from './components/layout/FeaturePanel'
import { ProjectLanding } from './pages/ProjectLanding'
import { ProjectDetail } from './pages/ProjectDetail'
// Lazy load heavy components
const AboutMePage = lazy(() => import('./pages/AboutMePage').then(module => ({ default: module.AboutMePage })));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage').then(module => ({ default: module.DesignSystemPage })));
const MusicPage = lazy(() => import('./pages/MusicPage').then(module => ({ default: module.MusicPage })));
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
  useLiveMode({
    allowStudioOrigin: 'http://localhost:3333',
  });

  const { isBootSequenceActive, setBootSequence, isAboutMeOpen, isSettingsOpen, debugMode, brandTheme } = useAppStore();
  const location = useLocation();
  const isDetailPage = !!matchPath('/projects/:projectId', location.pathname);
  // Hide sidebars on detail pages to focus attention and improve performance
  const isFullWidth = isDetailPage;

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', brandTheme);
  }, [brandTheme]);

  // Fetch content on mount
  useEffect(() => {
    useProjectStore.getState().fetchProjects();
  }, []);



  // Pre-load Main Layout by rendering it hidden/behind BootScreen
  // This ensures no frame drop when boot sequence finishes
  return (
    <LanguageProvider>
      {/* Dev-only Annotation Tool */}
      {import.meta.env.DEV && (
        <div className="fixed z-[9999] pointer-events-none *:pointer-events-auto">
          <Agentation />
        </div>
      )}

      {/* Boot Screen Overlay - Highest Z-Index */}
      <AnimatePresence mode="wait">
        {isBootSequenceActive && (
          <BootScreen onComplete={() => setBootSequence(false)} />
        )}
      </AnimatePresence>

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
                  <Route path="/projects" element={<ProjectLanding />} />
                  <Route path="/projects/:projectId" element={<ProjectDetail />} />
                  <Route path="/design-system" element={
                    <Suspense fallback={<div className="flex h-full w-full items-center justify-center text-brand-primary animate-pulse tracking-widest">[ SYSTEM_ACCESSING... ]</div>}>
                      <DesignSystemPage />
                    </Suspense>
                  } />
                  <Route path="/music" element={
                    <Suspense fallback={<div className="flex h-full w-full items-center justify-center text-brand-primary animate-pulse tracking-widest">[ AUDIO_LINKing... ]</div>}>
                      <MusicPage />
                    </Suspense>
                  } />
                </Routes>

                {/* About Me Modal - 覆盖在 main-mid 区域内 */}
                <AnimatePresence>
                  {isAboutMeOpen && (
                    <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm text-brand-primary animate-pulse tracking-widest">[ IDENTITY_VERIFYING... ]</div>}>
                      <AboutMePage />
                    </Suspense>
                  )}
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
