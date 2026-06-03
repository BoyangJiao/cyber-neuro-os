/**
 * strip-glb-ktx2.mjs — remove KTX2/basisu textures from a GLB while keeping its
 * meshopt-compressed geometry + morph targets intact.
 *
 * facecap.glb (three.js face-capture model) ships meshopt-compressed geometry AND
 * a KTX2 (KHR_texture_basisu) texture, both marked `required`. We render it as a
 * point cloud, so the texture is dead weight — and KTX2 would force a basis
 * transcoder dependency at runtime. This strips the texture metadata (leaving the
 * meshopt geometry untouched, which drei's useGLTF decodes automatically), so the
 * result loads with a plain GLTFLoader + MeshoptDecoder.
 *
 * Usage: node scripts/strip-glb-ktx2.mjs <in.glb> <out.glb>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
    console.error('Usage: node scripts/strip-glb-ktx2.mjs <in.glb> <out.glb>');
    process.exit(1);
}

const GLB_MAGIC = 0x46546c67; // 'glTF'
const JSON_TYPE = 0x4e4f534a; // 'JSON'

const buf = readFileSync(inPath);
if (buf.readUInt32LE(0) !== GLB_MAGIC) {
    console.error('Not a GLB file');
    process.exit(1);
}

// Parse chunks.
const chunks = [];
let offset = 12;
while (offset < buf.length) {
    const len = buf.readUInt32LE(offset);
    const type = buf.readUInt32LE(offset + 4);
    const data = buf.subarray(offset + 8, offset + 8 + len);
    chunks.push({ type, data });
    offset += 8 + len;
}

const jsonChunk = chunks.find((c) => c.type === JSON_TYPE);
const gltf = JSON.parse(jsonChunk.data.toString('utf8'));

// Strip texture-related metadata (geometry/morphs untouched).
const before = {
    images: gltf.images?.length || 0,
    textures: gltf.textures?.length || 0,
    materials: gltf.materials?.length || 0,
};
delete gltf.images;
delete gltf.textures;
delete gltf.samplers;
for (const mat of gltf.materials || []) {
    if (mat.pbrMetallicRoughness) {
        delete mat.pbrMetallicRoughness.baseColorTexture;
        delete mat.pbrMetallicRoughness.metallicRoughnessTexture;
    }
    delete mat.normalTexture;
    delete mat.occlusionTexture;
    delete mat.emissiveTexture;
    delete mat.extensions; // e.g. KHR_texture_transform on a texture slot
}
const dropExt = new Set(['KHR_texture_basisu', 'KHR_texture_transform']);
const filterExt = (arr) => (arr || []).filter((e) => !dropExt.has(e));
gltf.extensionsUsed = filterExt(gltf.extensionsUsed);
gltf.extensionsRequired = filterExt(gltf.extensionsRequired);
if (gltf.extensionsUsed.length === 0) delete gltf.extensionsUsed;
if (gltf.extensionsRequired.length === 0) delete gltf.extensionsRequired;

// Re-encode JSON chunk, padded to 4 bytes with spaces.
let jsonStr = JSON.stringify(gltf);
while (jsonStr.length % 4 !== 0) jsonStr += ' ';
const newJson = Buffer.from(jsonStr, 'utf8');

// Reassemble: header + JSON chunk + remaining chunks (BIN) unchanged.
const out = [];
const headerTotalPlaceholder = Buffer.alloc(12);
headerTotalPlaceholder.writeUInt32LE(GLB_MAGIC, 0);
headerTotalPlaceholder.writeUInt32LE(2, 4);
out.push(headerTotalPlaceholder);

const pushChunk = (type, data) => {
    const head = Buffer.alloc(8);
    head.writeUInt32LE(data.length, 0);
    head.writeUInt32LE(type, 4);
    out.push(head, data);
};
pushChunk(JSON_TYPE, newJson);
for (const c of chunks) {
    if (c.type !== JSON_TYPE) pushChunk(c.type, c.data);
}

const result = Buffer.concat(out);
result.writeUInt32LE(result.length, 8); // total length
writeFileSync(outPath, result);

console.log(`Stripped ${inPath} -> ${outPath}`);
console.log(`  removed: ${before.images} images, ${before.textures} textures (kept ${before.materials} materials, meshopt geometry + morph targets)`);
console.log(`  size: ${(buf.length / 1024).toFixed(0)}KB -> ${(result.length / 1024).toFixed(0)}KB`);
