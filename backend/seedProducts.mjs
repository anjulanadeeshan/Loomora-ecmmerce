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
        image: [productImages.p_img2_1],
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

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Insert new products
        const createdProducts = await Product.insertMany(products);
        console.log(`✅ Seeded ${createdProducts.length} products successfully`);
        
        console.log('\nSample Product IDs:');
        createdProducts.slice(0, 3).forEach(product => {
            console.log(`- ${product.name}: ${product._id}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
