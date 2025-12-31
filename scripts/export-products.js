const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Schema Definition (matches src/models/Product.js/store.json structure)
const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    category: { type: String, default: 'Uncategorized' },
    height: String,
    width: String,
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function connectDB() {
    let mongoURI = 'mongodb://localhost:27017/arshi-sales';
    try {
        const envPath = path.join(__dirname, '../.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf-8');
            const match = envConfig.split('\n').find(l => l.startsWith('MONGODB_URI'));
            if (match) {
                mongoURI = match.substring(match.indexOf('=') + 1).trim();
                // Remove quotes
                if ((mongoURI.startsWith('"') && mongoURI.endsWith('"')) || (mongoURI.startsWith("'") && mongoURI.endsWith("'"))) {
                    mongoURI = mongoURI.slice(1, -1);
                }
            }
        }
    } catch (e) {
        console.log('Could not read .env.local, using default');
    }

    console.log(`Connecting to: ${mongoURI.replace(/:[^:@]+@/, ':****@')}`); // Hide password in logs
    await mongoose.connect(mongoURI);
}

async function exportProducts() {
    try {
        await connectDB();

        // 1. Fetch all products from DB
        const dbProducts = await Product.find({}).sort({ id: 1 }).lean();
        console.log(`Found ${dbProducts.length} products in Database.`);

        // 2. Read existing store.json
        const storePath = path.join(__dirname, '../data/store.json');
        let storeData = { categories: [], users: [], orders: [], products: [] };

        if (fs.existsSync(storePath)) {
            storeData = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
        }

        // 3. Update products list
        // We replace the 'products' array with what's in the DB to ensure they match exactly.
        // OR we can merge. Replacing is safer if DB is the source of truth for "Added Manually".
        storeData.products = dbProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            image: p.image,
            category: p.category,
            height: p.height,
            width: p.width
        }));

        // 4. Write back to store.json
        fs.writeFileSync(storePath, JSON.stringify(storeData, null, 2));
        console.log(`Exported ${dbProducts.length} products to data/store.json`);

        process.exit(0);
    } catch (error) {
        console.error('Export failed:', error);
        process.exit(1);
    }
}

exportProducts();
