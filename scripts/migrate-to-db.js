const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load env from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split(/\r?\n/).forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2 && parts[0].trim() === 'MONGODB_URI') {
            process.env.MONGODB_URI = parts.slice(1).join('=').trim();
        }
    });
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arshi-sales';

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    height: String,
    width: String,
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    customerDetails: { name: String, email: String },
    items: Array,
    subtotal: Number,
    previousPendingAmount: Number,
    total: Number,
    paymentMethod: String,
    transactionId: String,
    paymentStatus: { type: String, default: 'pending' },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

async function migrate() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const storePath = path.join(__dirname, '../data/store.json');
    if (!fs.existsSync(storePath)) {
        console.error('store.json not found!');
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(storePath, 'utf-8'));

    // Migrate Users
    if (data.users && data.users.length > 0) {
        console.log(`Migrating ${data.users.length} users...`);
        for (const user of data.users) {
            const exists = await User.findOne({ id: user.id });
            if (!exists) {
                await User.create(user);
            }
        }
    }

    // Migrate Products
    if (data.products && data.products.length > 0) {
        console.log(`Migrating ${data.products.length} products...`);
        for (const product of data.products) {
            const exists = await Product.findOne({ id: product.id });
            if (!exists) {
                await Product.create(product);
            }
        }
    }

    // Migrate Orders
    if (data.orders && data.orders.length > 0) {
        console.log(`Migrating ${data.orders.length} orders...`);
        for (const order of data.orders) {
            const exists = await Order.findOne({ id: order.id });
            if (!exists) {
                await Order.create(order);
            }
        }
    }

    console.log('Migration complete.');
    process.exit(0);
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
