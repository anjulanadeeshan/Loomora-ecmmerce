import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendDirectory = path.resolve(scriptDirectory, '..');
const repositoryRoot = path.resolve(backendDirectory, '..');
const manifestPath = path.join(backendDirectory, 'data', 'pendingCloudinaryProducts.json');
const localImagesDirectory = path.join(
    repositoryRoot,
    'frontend',
    'src',
    'assets',
    'frontend_assets',
    'products'
);

dotenv.config({ path: path.join(backendDirectory, '.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

const getResources = async (assetFolder) => {
    const resources = [];
    let nextCursor;

    do {
        const page = await cloudinary.api.resources_by_asset_folder(assetFolder, {
            max_results: 500,
            next_cursor: nextCursor
        });
        resources.push(...page.resources);
        nextCursor = page.next_cursor;
    } while (nextCursor);

    return resources;
};

const main = async () => {
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    const localFiles = await Promise.all(manifest.products.map(async (entry) => {
        const filePath = path.join(localImagesDirectory, entry.sourceFile);
        const contents = await fs.readFile(filePath);
        return {
            frontendId: entry.frontendId,
            sourceFile: entry.sourceFile,
            bytes: contents.length,
            hash: sha256(contents)
        };
    }));

    const resources = await getResources(manifest.cloudinaryAssetFolder);
    const candidateResources = resources.filter((resource) =>
        localFiles.some((file) => file.bytes === resource.bytes)
    );

    const downloadedResources = await Promise.all(candidateResources.map(async (resource) => {
        const response = await fetch(resource.secure_url);
        if (!response.ok) {
            throw new Error(`Could not download ${resource.public_id}: ${response.status}`);
        }

        const contents = Buffer.from(await response.arrayBuffer());
        return { ...resource, hash: sha256(contents) };
    }));

    const matches = localFiles.map((file) => {
        const resource = downloadedResources.find((candidate) => candidate.hash === file.hash);
        if (!resource) {
            return { ...file, matched: false };
        }

        return {
            ...file,
            matched: true,
            publicId: resource.public_id,
            createdAt: resource.created_at,
            url: resource.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')
        };
    });

    console.log(JSON.stringify({
        cloudinaryAssets: resources.length,
        matched: matches.filter((entry) => entry.matched).length,
        unmatched: matches.filter((entry) => !entry.matched).length,
        products: matches
    }, null, 2));
};

main().catch((error) => {
    console.error('Pending Cloudinary match failed:', error.message);
    process.exitCode = 1;
});
