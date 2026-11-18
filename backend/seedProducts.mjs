import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import Product from './models/productModel.js';

dotenv.config();

const productImages = JSON.parse(
    await fs.readFile(new URL('./data/cloudinaryProductImages.json', import.meta.url), 'utf8')
);

// Sample products data (you can expand this)
const products = [
    {
        name: "Women Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 100,
        image: [productImages.p_img1],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        date: Date.now(),
        bestseller: true
    },
    {
        name: "Men Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 200,
        image: [
            productImages.p_img2,
            productImages.p_img2_1,
            productImages.p_img2_2,
            productImages.p_img2_3,
            productImages.p_img2_4
        ],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["M", "L", "XL"],
        date: Date.now(),
        bestseller: true
    },
    {
        name: "Girls Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 220,
        image: [productImages.p_img3],
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["S", "L", "XL"],
        date: Date.now(),
        bestseller: true
    },
    {
        name: "Men Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 110,
        image: [productImages.p_img4],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "XXL"],
        date: Date.now(),
        bestseller: true
    },
    {
        name: "Women Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 130,
        image: [productImages.p_img5],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["M", "L", "XL"],
        date: Date.now(),
        bestseller: true
    },
    {
        name: "Girls Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 140,
        image: [productImages.p_img6],
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["S", "L", "XL"],
        date: Date.now(),
        bestseller: true
    },
    {
        name: "Men Tapered Fit Flat-Front Trousers",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 190,
        image: [productImages.p_img7],
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["S", "L", "XL"],
        date: Date.now(),
        bestseller: false
    },
    {
        name: "Men Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 140,
        image: [productImages.p_img8],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        date: Date.now(),
        bestseller: false
    },
    {
        name: "Girls Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 100,
        image: [productImages.p_img9],
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["M", "L", "XL"],
        date: Date.now(),
        bestseller: false
    },
    {
        name: "Men Tapered Fit Flat-Front Trousers",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 110,
        image: [productImages.p_img10],
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["S", "L", "XL"],
        date: Date.now(),
        bestseller: false
    }
];

const seedProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Preserve any products already managed in MongoDB and add missing catalogue products.
        for (const product of products) {
            await Product.updateOne(
                { image: product.image[0] },
                { $setOnInsert: product },
                { upsert: true }
            );
        }

        let addedCount = 0;
        for (let index = 11; index <= 52; index += 1) {
            const imageKey = `p_img${index}`;
            const imageUrl = productImages[imageKey];
            if (!imageUrl) {
                continue;
            }

            const category = ['Women', 'Men', 'Kids'][index % 3];
            const subCategory = ['Topwear', 'Bottomwear', 'Winterwear'][index % 3];
            const product = {
                name: `Loomora Collection Piece ${index}`,
                description: `A curated Loomora ${subCategory.toLowerCase()} piece selected for everyday style and comfortable wear.`,
                price: 100 + (index * 5),
                image: [imageUrl],
                category,
                subCategory,
                sizes: ['S', 'M', 'L', 'XL'],
                date: Date.now() + index,
                bestseller: index % 11 === 0
            };

            const result = await Product.updateOne(
                { image: imageUrl },
                { $setOnInsert: product },
                { upsert: true }
            );
            if (result.upsertedCount === 1) {
                addedCount += 1;
            }
        }

        const totalProducts = await Product.countDocuments();
        console.log(`✅ Catalogue sync complete: ${totalProducts} MongoDB products available`);
        console.log(`✅ Added ${addedCount} Cloudinary catalogue products`);
        
        console.log('\nSample Product IDs:');
        const sampleProducts = await Product.find({}).limit(3);
        sampleProducts.forEach(product => {
            console.log(`- ${product.name}: ${product._id}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
