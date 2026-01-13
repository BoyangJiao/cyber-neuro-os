import { useAppStore, type GeometryType } from '../../../store/useAppStore';

const geometryTypes: { type: GeometryType; label: string; icon: string }[] = [
    { type: 'project', label: 'PROJECT', icon: 'ri-rocket-2-line' },
    { type: 'video', label: 'VIDEO', icon: 'ri-movie-2-line' },
    { type: 'game', label: 'GAME', icon: 'ri-gamepad-line' },
    { type: 'sound', label: 'SOUND', icon: 'ri-voiceprint-line' },
    { type: 'music', label: 'MUSIC', icon: 'ri-music-2-line' },
    { type: 'lab', label: 'LAB', icon: 'ri-flask-line' },
];

/**
 * GeometryTab - 几何体类型选择
 */
export const GeometryTab = () => {
    const { debugGeometryType, setDebugGeometryType } = useAppStore();

    return (
        <div className="space-y-2">
            <p className="text-[9px] text-cyan-700 uppercase tracking-wider">Select 3D geometry</p>
            <div className="grid grid-cols-3 gap-1.5">
                {geometryTypes.map((geo) => (
                    <button
                        key={geo.type}
                        onClick={() => setDebugGeometryType(geo.type)}
                        className={`relative py-2 px-1 border transition-all duration-200 ${debugGeometryType === geo.type
                                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200'
                                : 'border-cyan-800/50 bg-cyan-950/30 text-cyan-600 hover:border-cyan-600 hover:text-cyan-400'
                            }`}
                    >
                        {debugGeometryType === geo.type && (
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent" />
                        )}
                        <div className="relative z-10 flex flex-col items-center gap-0.5">
                            <i className={`${geo.icon} text-base`} />
                            <span className="text-[8px] font-semibold tracking-wider">{geo.label}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
