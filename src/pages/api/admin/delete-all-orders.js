import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    // In a real app, verify Admin token here

    try {
        await Order.deleteMany({}); // Clear all orders
        res.status(200).json({ message: 'All orders have been deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
