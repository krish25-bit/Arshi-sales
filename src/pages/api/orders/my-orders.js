import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const userOrders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ orders: userOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
