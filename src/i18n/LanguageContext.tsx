import { useProjectStore } from '../store/useProjectStore';
import type { Language } from './translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

/**
 * Direct hook for language access — delegates to Zustand store.
 * Replaces the previous React Context wrapper to avoid redundant re-render layer.
 */
export const useLanguage = (): LanguageContextType => {
    const language = useProjectStore((s) => s.language);
    const setLanguage = useProjectStore((s) => s.setLanguage);
    return { language, setLanguage };
};

/**
 * @deprecated LanguageProvider is no longer needed.
 * useLanguage now reads directly from Zustand. Keep this as a passthrough for compatibility.
 */
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};
