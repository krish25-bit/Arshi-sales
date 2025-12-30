const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ProductSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    category: String
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function checkProducts() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI missing');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const products = await Product.find({});
        console.log('--- ALL PRODUCTS ---');
        products.forEach(p => {
            console.log(`ID: ${p.id} | Name: ${p.name} | Category: "${p.category}"`);
        });
        console.log('--------------------');

        console.log('Checking specifically for "Tobacco" (case insensitive)...');
        const tobaccoProducts = await Product.find({ category: { $regex: new RegExp('^tobacco$', 'i') } });
        console.log(`Found ${tobaccoProducts.length} tobacco products.`);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

checkProducts();
