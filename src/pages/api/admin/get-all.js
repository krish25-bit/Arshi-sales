import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import Order from '../../../models/Order';
import Product from '../../../models/Product';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const users = await User.find({}, '-password'); // Exclude password
        const orders = await Order.find().sort({ createdAt: -1 });

        // Fetch from DB
        const products = await Product.find().sort({ id: 1 });

        res.status(200).json({ users, orders, products });
    } catch (error) {
        console.error('Admin API Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
