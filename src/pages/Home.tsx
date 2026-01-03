import { MainLayout } from '../components/layout/MainLayout'
import { Footer } from '../components/layout/Footer'
import { FeaturePanel } from '../components/layout/FeaturePanel'
import { ProfileSidebar } from '../components/layout/ProfileSidebar'
import { StatusSidebar } from '../components/layout/StatusSidebar'

export const Home = () => {
    return (
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
