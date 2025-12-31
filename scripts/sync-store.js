const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Schema Definition (matches src/models/Product.js)
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

// Connection logic
async function connectDB() {
    let mongoURI = 'mongodb://localhost:27017/arshi-sales'; // Default

    // Try to find .env.local
    try {
        const envPath = path.join(__dirname, '../.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf-8');
            const match = envConfig.split('\n').find(l => l.startsWith('MONGODB_URI'));
            if (match) {
                mongoURI = match.split('=')[1].trim();
                // Remove quotes if present
                if ((mongoURI.startsWith('"') && mongoURI.endsWith('"')) || (mongoURI.startsWith("'") && mongoURI.endsWith("'"))) {
                    mongoURI = mongoURI.slice(1, -1);
                }
            }
        }
    } catch (e) {
        console.log('Could not read .env.local, using default localhost URI');
    }

    console.log(`Connecting to MongoDB at: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
}

async function syncProducts() {
    try {
        await connectDB();

        const storePath = path.join(__dirname, '../data/store.json');
        if (!fs.existsSync(storePath)) {
            console.error('Error: data/store.json not found!');
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
        const products = data.products || [];

        console.log(`Found ${products.length} products in store.json`);

        for (const p of products) {
            console.log(`Syncing: ${p.name}...`);
            await Product.findOneAndUpdate(
                { id: p.id },
                {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    description: p.description,
                    image: p.image,
                    category: p.category || 'Uncategorized'
                },
                { upsert: true, new: true }
            );
        }

        console.log('Sync complete!');
        process.exit(0);

    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
}

syncProducts();
