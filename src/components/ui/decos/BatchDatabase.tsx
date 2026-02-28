import { Barcode } from './Barcode';
import { useTranslation } from '../../../i18n';

export const BatchDatabase = () => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-2 2xl:gap-3 opacity-40 text-brand-primary pointer-events-none">
            {/* Barcode Graphic */}
            <div className="shrink-0">
                <Barcode className="h-9 lg:h-10 2xl:h-11 w-auto opacity-90" />
            </div>

            {/* Legal / Deco Text */}
            <div className="flex flex-col gap-1.5 2xl:gap-2">
                <div className="text-[11px] font-bold font-display tracking-wide uppercase leading-none">
                    {t('footer.legal.title')}
                </div>
                <div className="flex flex-col gap-0 text-[8px] leading-[1.3] font-sans font-medium opacity-70">
                    <p>{t('footer.legal.p1')}</p>
                    <p>{t('footer.legal.p2')}</p>
                </div>
            </div>
        </div>
    );
};
