import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    const { orderId, manualDiscount, finalTotal, items } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
    }

    try {
        const order = await Order.findOne({ id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.manualDiscount = Number(manualDiscount) || 0;

        // Update items if provided
        if (items && Array.isArray(items)) {
            order.items = items;
            order.markModified('items'); // Ensure Mongoose detects the change
        }

        // Calculate Final Total:
        // 1. Sum of (Item Price * Qty) - uses updatedPrice if available, else original price
        // 2. Subtract Discount
        // 3. Or use explicit finalTotal if strictly enforced (but per-item pricing suggests calculation)

        let calculatedSubtotal = 0;
        order.items.forEach(item => {
            const price = (item.updatedPrice !== undefined && item.updatedPrice !== null) ? Number(item.updatedPrice) : item.price;
            calculatedSubtotal += price * (item.quantity || 1);
        });

        // If finalTotal is passed explicitly (manual override of the whole bill), use it.
        // Otherwise, derive from items - discount.
        if (finalTotal !== undefined && finalTotal !== null && finalTotal !== '') {
            order.finalTotal = Number(finalTotal);
        } else {
            order.finalTotal = calculatedSubtotal - order.manualDiscount;
        }

        await order.save();

        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Update Order Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
