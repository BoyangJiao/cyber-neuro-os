import { AnimatePresence } from 'framer-motion';
import { HoloFrame } from '../HoloFrame';
import { CyberButton } from '../CyberButton';
import { MotionDiv } from '../../motion/MotionWrappers';

interface InterceptModalProps {
    isOpen: boolean;
    onClose: () => void;
    moduleName: string | null;
}

export const InterceptModal = ({ isOpen, onClose, moduleName }: InterceptModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <MotionDiv
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-[2px]"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <MotionDiv
                        className="relative w-[90vw] max-w-[360px]"
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                    >
                        <HoloFrame variant="dots" active={true}>
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1.5 h-5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                <h2 className="text-sm font-bold text-amber-500 tracking-[0.3em] uppercase">
                                    COMPILING
                                </h2>
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                {/* Icon & Status */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 border border-amber-500/30 flex items-center justify-center bg-amber-500/5">
                                        <i className="ri-loader-4-line text-2xl text-amber-500 animate-spin" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            TARGET MODULE
                                        </p>
                                        <p className="text-base font-bold text-[var(--color-text-primary)] tracking-wide">
                                            {moduleName}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-[var(--color-text-secondary)]/80 leading-relaxed border-t border-[var(--color-text-subtle)]/20 pt-3">
                                    模块数据编译中，神经通路尚未建立连接。请稍后再次尝试访问。
                                </p>

                                {/* Action */}
                                <div className="pt-2">
                                    <CyberButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={onClose}
                                        className="w-full"
                                    >
                                        ACKNOWLEDGE
                                    </CyberButton>
                                </div>
                            </div>
                        </HoloFrame>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};
