import { ProjectGeometry } from './geometries/ProjectGeometry';
import { VideoGeometry } from './geometries/VideoGeometry';
import { GameGeometry } from './geometries/GameGeometry';
import { SoundGeometry } from './geometries/SoundGeometry';
import { MusicGeometry } from './geometries/MusicGeometry';
import { LabGeometry } from './geometries/LabGeometry';
import { CameraGeometry } from './geometries/CameraGeometry';
import { BookGeometry } from './geometries/BookGeometry';

export type GeometryType = 'project' | 'video' | 'game' | 'sound' | 'music' | 'lab' | 'camera' | 'book';

interface HoloGeometryProps {
    type: GeometryType;
}

/**
 * HoloGeometry - 统一入口组件
 * 
 * 根据 type 渲染对应的 3D 几何体
 */
export const HoloGeometry = ({ type }: HoloGeometryProps) => {
    switch (type) {
        case 'project':
            return <ProjectGeometry />;
        case 'video':
            return <VideoGeometry />;
        case 'game':
            return <GameGeometry />;
        case 'sound':
            return <SoundGeometry />;
        case 'music':
            return <MusicGeometry />;
        case 'lab':
            return <LabGeometry />;
        case 'camera':
            return <CameraGeometry />;
        case 'book':
            return <BookGeometry />;
        default:
            return <ProjectGeometry />;
    }
};

export { ProjectGeometry } from './geometries/ProjectGeometry';
export { VideoGeometry } from './geometries/VideoGeometry';
export { GameGeometry } from './geometries/GameGeometry';
export { SoundGeometry } from './geometries/SoundGeometry';
export { MusicGeometry } from './geometries/MusicGeometry';
export { LabGeometry } from './geometries/LabGeometry';
export { CameraGeometry } from './geometries/CameraGeometry';
export { BookGeometry } from './geometries/BookGeometry';
