import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import User from '../../../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    const { userId, items, total, customerDetails, paymentMethod, transactionId } = req.body;

    try {
        const userExists = await User.findOne({ id: userId });
        // Also check by _id if needed, but schema uses 'id' string.
        // If userId is 'guest' (if supported), handle it? 
        // Existing code checks "if (!userId || !userExists)".

        if (!userId || !userExists) {
            return res.status(401).json({ message: 'Unauthorized: Please login to place an order.' });
        }

        // Calculate pending dues from previous orders
        const pendingOrders = await Order.find({ userId, paymentStatus: 'pending' });
        const previousPendingAmount = pendingOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        const finalTotal = (total || 0) + previousPendingAmount;

        const newOrder = await Order.create({
            id: Date.now().toString(),
            userId: userId,
            customerDetails,
            items,
            subtotal: total,
            previousPendingAmount,
            total: finalTotal,
            paymentMethod: paymentMethod || 'Unknown',
            transactionId: transactionId || null,
            paymentStatus: paymentMethod === 'UPI' ? 'verification_pending' : 'pending',
            status: 'pending',
            createdAt: new Date()
        });

        // Mark previous pending orders as 'carried_forward'
        if (previousPendingAmount > 0) {
            await Order.updateMany(
                { userId, paymentStatus: 'pending', _id: { $ne: newOrder._id } }, // Exclude the new order just in case, though it's 'pending' too?
                // Wait, logic says logic "Mark previous pending orders". The new order has paymentStatus pending/verification_pending.
                // If the new order is 'pending' (COD), we shouldn't mark IT as carried_forward immediately?
                // The new order is just created.
                // The query `userId` and `paymentStatus: 'pending'` matches the new order too if it is COD!
                // So we MUST exclude the new order.
                { $set: { paymentStatus: 'carried_forward' } }
            );
            // Actually, `newOrder` is already saved.
            // But we should use `createdAt` or exclude new ID.
            // Using logic: update orders created BEFORE now? 
            // Or easier: update BEFORE creating the new order? NO, we need previousPendingAmount.
            // So exclude new ID.
        }

        // Re-fix the "exclude new one" logic:
        if (previousPendingAmount > 0) {
            await Order.updateMany(
                { userId, paymentStatus: 'pending', id: { $ne: newOrder.id } },
                { $set: { paymentStatus: 'carried_forward' } }
            );
        }

        res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder,
            warning: previousPendingAmount > 0 ? `Note: A previous pending amount of ₹${previousPendingAmount} has been added to your total.` : null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
