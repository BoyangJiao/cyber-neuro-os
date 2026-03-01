import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const ffmpegPath = ffmpeg.path;
const soundsDir = path.resolve('public/sounds');

function convertDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            convertDir(fullPath);
        } else if (file.endsWith('.wav')) {
            const outputPath = fullPath.replace('.wav', '.mp3');
            console.log(`Converting: ${fullPath} -> ${outputPath}`);
            try {
                // -y: overwrite
                // -i: input
                // -vn: disable video (ignore album art/covers)
                // -map_metadata -1: strip all metadata
                // -codec:a libmp3lame: use mp3 encoder
                // -qscale:a 4: high quality VBR (approx 165 kbps)
                // -ac 1: convert to mono for UI sounds (to save space)
                execSync(`"${ffmpegPath}" -y -i "${fullPath}" -vn -map_metadata -1 -codec:a libmp3lame -qscale:a 4 -ac 1 "${outputPath}"`, { stdio: 'inherit' });
                console.log(`Successfully converted ${file}`);
            } catch (err) {
                console.error(`Error converting ${file}:`, err.message);
            }
        }
    }
}

console.log(`Using FFmpeg from: ${ffmpegPath}`);
convertDir(soundsDir);
