import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendDirectory = path.resolve(scriptDirectory, '..');
const repositoryRoot = path.resolve(backendDirectory, '..');
const assetsPath = path.join(repositoryRoot, 'frontend/src/assets/frontend_assets/assets.js');
const productImagesPath = path.join(repositoryRoot, 'frontend/src/assets/frontend_assets/productImages.js');
const backupDirectory = path.join(backendDirectory, 'data/backups');
const shouldApply = process.argv.includes('--apply');

dotenv.config({ path: path.join(backendDirectory, '.env') });

const readImageVariables = async () => {
    const source = await fs.readFile(productImagesPath, 'utf8');
    const entries = [...source.matchAll(/export const (\w+)\s*=\s*("(?:[^"\\]|\\.)*");/g)]
        .map((match) => [match[1], JSON.parse(match[2])]);

    if (entries.length === 0) {
        throw new Error('No product image variables were found.');
    }

    return Object.fromEntries(entries);
};

const readFrontendProducts = async () => {
    const [source, imageVariables] = await Promise.all([
        fs.readFile(assetsPath, 'utf8'),
        readImageVariables()
    ]);
    const marker = 'export const products = ';
    const start = source.indexOf(marker);

    if (start === -1) {
        throw new Error('Could not locate the frontend products array.');
    }

    const expression = source.slice(start + marker.length).trim().replace(/;\s*$/, '');
    const variableNames = Object.keys(imageVariables);
    const variableValues = variableNames.map((name) => imageVariables[name]);
    const products = Function(...variableNames, `"use strict"; return (${expression});`)(...variableValues);

    if (!Array.isArray(products) || products.length === 0) {
        throw new Error('The frontend catalogue is empty or invalid.');
    }

    return products;
};

const canonicalProduct = (product) => ({
    name: product.name,
    description: product.description,
    price: product.price,
    image: [...product.image],
    category: product.category,
    subCategory: product.subCategory,
    sizes: [...product.sizes],
    bestseller: Boolean(product.bestseller),
    date: product.date
});

const validateProducts = (products) => {
    const supportedCategories = new Set(['Men', 'Women', 'Kids']);
    const supportedSubCategories = new Set(['Topwear', 'Bottomwear', 'Winterwear']);
    const primaryImages = new Set();

    products.forEach((product, index) => {
        if (!product.name || !product.description) {
            throw new Error(`Product ${index + 1} is missing a name or description.`);
        }
        if (!Number.isFinite(product.price) || product.price <= 0) {
            throw new Error(`Product ${index + 1} has an invalid price: ${product.price}`);
        }
        if (!supportedCategories.has(product.category) || !supportedSubCategories.has(product.subCategory)) {
            throw new Error(`Product ${index + 1} has an unsupported category.`);
        }
        if (!Array.isArray(product.image) || product.image.length === 0 || !product.image.every((image) => image.startsWith('https://res.cloudinary.com/'))) {
            throw new Error(`Product ${index + 1} does not contain Cloudinary image URLs.`);
        }
        if (primaryImages.has(product.image[0])) {
            throw new Error(`Duplicate primary image found for product ${index + 1}.`);
        }
        primaryImages.add(product.image[0]);
    });
};

const createBackup = async (products) => {
    await fs.mkdir(backupDirectory, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDirectory, `products-before-frontend-sync-${timestamp}.json`);
    await fs.writeFile(backupPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8');
    return backupPath;
};

const comparable = (product) => JSON.stringify(canonicalProduct(product));

const main = async () => {
    const frontendProducts = (await readFrontendProducts()).map(canonicalProduct);
    validateProducts(frontendProducts);

    await mongoose.connect(process.env.MONGODB_URI);
    const existingProducts = await Product.find({}).sort({ createdAt: 1 }).lean();
    const existingByPrimaryImage = new Map();
    const claimedExistingIds = new Set();

    existingProducts.forEach((product) => {
        const primaryImage = product.image?.[0];
        const matches = existingByPrimaryImage.get(primaryImage) ?? [];
        matches.push(product);
        existingByPrimaryImage.set(primaryImage, matches);
    });

    const matchesByFrontendPrimaryImage = new Map();
    frontendProducts.forEach((product) => {
        const primaryMatches = existingByPrimaryImage.get(product.image[0]) ?? [];
        const existing = primaryMatches.find((candidate) => !claimedExistingIds.has(String(candidate._id)))
            ?? existingProducts.find((candidate) =>
                !claimedExistingIds.has(String(candidate._id))
                && candidate.image?.includes(product.image[0])
            );

        if (existing) {
            claimedExistingIds.add(String(existing._id));
            matchesByFrontendPrimaryImage.set(product.image[0], existing);
        }
    });

    const exactMatches = frontendProducts.filter((product) => {
        const existing = matchesByFrontendPrimaryImage.get(product.image[0]);
        return existing && comparable(existing) === comparable(product);
    }).length;
    const matchedProducts = matchesByFrontendPrimaryImage.size;
    const insertCount = frontendProducts.length - matchedProducts;
    const expectedRemovalCount = existingProducts.length - matchedProducts;

    console.log(JSON.stringify({
        mode: shouldApply ? 'apply' : 'preview',
        frontendProducts: frontendProducts.length,
        databaseProducts: existingProducts.length,
        exactMatches,
        recordsToUpdate: matchedProducts - exactMatches,
        recordsToInsert: insertCount,
        recordsToRemove: expectedRemovalCount
    }, null, 2));

    if (!shouldApply) {
        await mongoose.disconnect();
        return;
    }

    const backupPath = await createBackup(existingProducts);
    const keepIds = [];
    const operations = [];

    frontendProducts.forEach((product) => {
        const existing = matchesByFrontendPrimaryImage.get(product.image[0]);
        const id = existing?._id ?? new mongoose.Types.ObjectId();
        keepIds.push(id);

        if (existing) {
            operations.push({
                updateOne: {
                    filter: { _id: id },
                    update: { $set: product }
                }
            });
        } else {
            operations.push({
                insertOne: {
                    document: { _id: id, ...product }
                }
            });
        }
    });

    await Product.bulkWrite(operations, { ordered: true });
    const removal = await Product.deleteMany({ _id: { $nin: keepIds } });
    const synchronizedProducts = await Product.find({}).lean();

    if (synchronizedProducts.length !== frontendProducts.length) {
        throw new Error(`Expected ${frontendProducts.length} synchronized products, found ${synchronizedProducts.length}.`);
    }

    const synchronizedByPrimaryImage = new Map(
        synchronizedProducts.map((product) => [product.image[0], product])
    );
    const mismatches = frontendProducts.filter((product) => {
        const synchronized = synchronizedByPrimaryImage.get(product.image[0]);
        return !synchronized || comparable(synchronized) !== comparable(product);
    });

    if (mismatches.length > 0) {
        throw new Error(`${mismatches.length} database products do not match the frontend catalogue.`);
    }

    console.log(JSON.stringify({
        synchronizedProducts: synchronizedProducts.length,
        removedProducts: removal.deletedCount,
        backupPath,
        priceMinimum: Math.min(...synchronizedProducts.map((product) => product.price)),
        priceMaximum: Math.max(...synchronizedProducts.map((product) => product.price))
    }, null, 2));

    await mongoose.disconnect();
};

main().catch(async (error) => {
    console.error('Frontend catalogue sync failed:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
});
