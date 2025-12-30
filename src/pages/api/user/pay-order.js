import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    const { userId, orderId, paymentMethod, transactionId } = req.body;

    if (!userId || !orderId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const order = await Order.findOne({ id: orderId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Security check: Ensure order belongs to the user
        // Note: userId in Schema is String.
        if (order.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update payment status
        order.paymentStatus = 'verification_pending';
        order.paymentMethod = paymentMethod || 'Online';
        order.transactionId = transactionId || null;

        await order.save();

        res.status(200).json({ message: 'Payment successful', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
