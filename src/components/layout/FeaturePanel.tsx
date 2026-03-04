/**
 * FeaturePanel v3.3 — Empty container (nav moved to Header)
 *
 * The particle field is full-screen in App.tsx.
 * Navigation dock is now in Header.tsx.
 * This component is just a spacer for the home route.
 */
export const FeaturePanel = () => {
    return (
        <div className="relative w-full h-full min-h-[400px] xl:min-h-[500px] 2xl:min-h-[600px]">
            {/* Intentionally empty — particles + nav are global */}
        </div>
    );
};
