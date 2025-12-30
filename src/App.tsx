import { useState, useEffect } from 'react'
import { BootScreen } from './components/layout/BootScreen'
import { MainLayout } from './components/layout/MainLayout'
import { Footer } from './components/layout/Footer'
import { FeatureCard } from './components/ui/FeatureCard'
import { ProfileSidebar } from './components/layout/ProfileSidebar'
import { StatusSidebar } from './components/layout/StatusSidebar'

interface FeatureItem {
  title: string;
  icon: string;
}

function App() {
  const [bootSequence, setBootSequence] = useState(true);

  // Simulate boot sequence completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootSequence(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const features: FeatureItem[] = [
    { title: 'PROJECT', icon: 'ri-rocket-2-line' },
    { title: 'VIDEO', icon: 'ri-movie-2-line' },
    { title: 'GAME', icon: 'ri-gamepad-line' },
    { title: 'SOUND', icon: 'ri-voiceprint-line' },
    { title: 'MUSIC', icon: 'ri-music-2-line' },
    { title: 'LAB', icon: 'ri-flask-line' },
  ];

  return (
    <div className="bg-cyber-950 min-h-screen">
      {bootSequence ? (
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
            <div className="col-span-1 lg:col-span-8 flex flex-col h-full px-8 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr h-full">
                {features.map((item) => (
                  <FeatureCard
                    key={item.title}
                    title={item.title}
                    icon={item.icon}
                  />
                ))}
              </div>
            </div>

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
