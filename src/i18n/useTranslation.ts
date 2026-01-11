import { useLanguage } from './LanguageContext';
import { translations } from './translations';

/**
 * Hook for accessing translations
 * Returns a `t` function that retrieves translated strings by key path
 * 
 * @example
 * const { t } = useTranslation();
 * t('footer.settings') // Returns "SETTINGS" or "设置" based on current language
 */
export const useTranslation = () => {
    const { language } = useLanguage();

    /**
     * Get a translated string by dot-notation key path
     * @param key - Dot-notation path like 'footer.settings' or 'about.workExperience.label'
     * @returns The translated string for the current language
     */
    const t = (key: string): string => {
        const keys = key.split('.');
        let value: unknown = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = (value as Record<string, unknown>)[k];
            } else {
                // Development only warning
                if (import.meta.env.DEV) {
                    console.warn(`Translation key not found: ${key}`);
                }
                return key; // Return key as fallback
            }
        }

        if (typeof value === 'string') {
            return value;
        }

        // Development only warning
        if (import.meta.env.DEV) {
            console.warn(`Translation key "${key}" did not resolve to a string`);
        }
        return key;
    };

    return { t, language };
};
