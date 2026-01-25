import { BiometricMonitor } from '../ui/BiometricMonitor';

export const StatusSidebar = () => {
    return (
        <div className="flex flex-col items-end h-full pr-4 lg:pr-6 xl:pr-8 py-3 lg:py-4">
            {/* Fixed Width Container matching ProfileSidebar */}
            <div className="flex flex-col gap-4 lg:gap-6 2xl:gap-8 shrink-0 w-[160px] lg:w-[200px] xl:w-[240px] 2xl:w-[280px] h-full">

                {/* Biometric Monitor without container border */}
                <BiometricMonitor />

            </div>
        </div>
    );
};
