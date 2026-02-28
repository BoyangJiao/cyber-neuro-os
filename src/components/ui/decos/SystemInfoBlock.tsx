import { motion } from 'framer-motion';

interface SystemInfoBlockProps {
    className?: string;
}

/**
 * SystemInfoBlockAlpha — The left-hand detail block
 * (Previously created, now updated with brand-secondary color and refined layout)
 */
export const SystemInfoBlockAlpha = ({ className = "" }: SystemInfoBlockProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`flex flex-col gap-1.5 pointer-events-none select-none ${className}`}
        >
            {/* Top Border Line with Label */}
            <div className="relative w-full border-t border-brand-secondary/30">
                
            </div>

            {/* Content Body */}
            <div className="flex justify-between items-start w-full px-0.5 mt-1">
                {/* Left Side: Subject Identity */}
                <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-mono text-brand-secondary/40 leading-none">SUBJECT_ID</span>
                    <span className="text-[11px] font-mono text-brand-secondary/80 leading-none tracking-wider font-bold">BY-1750AB</span>
                </div>

                {/* Right Side: System Specs Matrix */}
                <div className="flex flex-col gap-1 items-end pt-0.5">
                    {[
                        ['MODEL NAME:', 'DIGITAL_TWIN_V1.0'],
                        ['MODEL TYPE:', 'HOLOG_DESIGNER'],
                        ['NEURAL_SYNC_RATIO:', '98.7%'],
                        ['LOAD ADDRESS:', '0x00091244']
                    ].map(([label, val]) => (
                        <div key={label} className="flex gap-2">
                            <span className="text-[8px] font-mono text-brand-secondary/30 leading-none text-right w-24">{label}</span>
                            <span className="text-[8px] font-mono text-brand-secondary/70 leading-none min-w-[80px] text-right font-medium">{val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

/**
 * SystemInfoBlockBeta — The right-hand detail block
 * (New design with boxed identifiers and commit status)
 */
export const SystemInfoBlockBeta = ({ className = "" }: SystemInfoBlockProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className={`flex flex-col gap-1.5 pointer-events-none select-none ${className}`}
        >
            {/* Top Border Line with Label */}
            <div className="relative w-full border-t border-brand-secondary/30">
                
            </div>

            {/* Content Body */}
            <div className="flex justify-between items-center w-full px-0.5 mt-1">
                {/* Left Side: ID */}
                <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-mono text-brand-secondary/80 leading-none tracking-wider font-bold uppercase">TRN_TLCAS_BDOD95</span>
                </div>

                {/* Right Side: Status Boxes */}
                <div className="flex gap-1 items-stretch">
                    {/* Box 1 */}
                    <div className="px-2 py-1.5 border border-brand-secondary/20 bg-brand-secondary/5">
                        <span className="text-[9px] font-mono text-brand-secondary/80 leading-none tracking-tight">TASK_MANAGER_SD11S</span>
                    </div>
                    {/* Box 2 (Stacked text) */}
                    <div className="px-1.5 py-1 border border-brand-secondary/20 flex flex-col justify-center gap-0.5">
                        <span className="text-[7px] font-mono text-brand-secondary/60 leading-none uppercase tracking-tighter">COMMIT CONFIRMATION</span>
                        <span className="text-[7px] font-mono text-brand-secondary/60 leading-none uppercase tracking-tighter">DIFFERENCE PROGRAM</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
