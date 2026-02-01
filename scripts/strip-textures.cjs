
const fs = require('fs');
const path = require('path');

const inputFile = path.resolve(__dirname, '../public/models/temp_helmet.gltf');
const outputFile = path.resolve(__dirname, '../public/models/temp_helmet_stripped.gltf');

try {
    const data = fs.readFileSync(inputFile, 'utf8');
    const json = JSON.parse(data);

    console.log(`Original Images: ${json.images ? json.images.length : 0}`);
    console.log(`Original Textures: ${json.textures ? json.textures.length : 0}`);

    // Remove top-level texture/image/sampler arrays
    delete json.images;
    delete json.textures;
    delete json.samplers;

    // Remove texture references from materials
    if (json.materials) {
        json.materials.forEach(mat => {
            if (mat.pbrMetallicRoughness) {
                delete mat.pbrMetallicRoughness.baseColorTexture;
                delete mat.pbrMetallicRoughness.metallicRoughnessTexture;
            }
            delete mat.normalTexture;
            delete mat.occlusionTexture;
            delete mat.emissiveTexture;
        });
    }

    console.log('Stripped textures from materials.');

    fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));
    console.log(`Refined GLTF written to: ${outputFile}`);

} catch (err) {
    console.error('Error processing GLTF:', err);
    process.exit(1);
}
