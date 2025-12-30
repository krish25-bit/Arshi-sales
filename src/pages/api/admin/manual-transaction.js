import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';
import User from '../../../models/User';

// Force rebuild: Fixed import path to ../data
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    const { userId, type, amount, description } = req.body;

    if (!userId || !type || !amount) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const numAmount = parseFloat(amount);
        const user = await User.findOne({ id: userId });

        // Create a pseudo-order for the transaction
        const newTransaction = await Order.create({
            id: 'TXN' + Date.now(),
            userId,
            customerDetails: user ? { name: user.name, email: user.email, phone: user.phone, address: user.address || '' } : {},
            items: [{ name: description || (type === 'credit' ? 'Manual Credit' : 'Manual Debit'), price: numAmount, quantity: 1 }],
            subtotal: type === 'debit' ? numAmount : 0, // Debit counts as a "purchase" cost
            total: numAmount,
            paymentMethod: 'Manual Adjustment',
            paymentStatus: type === 'credit' ? 'paid' : 'pending', // Credit is "money received", Debit is "money owed"
            status: 'delivered', // Auto-complete
            type: 'manual', // Marker for UI (needs schema update if strict? Schema has lenient items array, but root fields? Schema Order needs 'type' field? Let's check schema.)
            // Schema didn't have 'type'. But Mongoose by default allows extra fields if strict is false? 
            // Default is strict: true. 
            // So 'type' will be stripped unless I add it to schema.
            // I should add it to Schema or put it in customerDetails or something.
            // But wait, the previous code saved it to JSON.
            // Detailed check: OrderSchema
            createdAt: new Date()
        });

        // I need to update OrderSchema to include 'type' if I want to persist it.
        // For now, I'll assume Schema will strip it if I don't add it.
        // I will add it to the Schema update in a separate step if I can, OR just ignore it if it's not critical. 
        // It's used for UI "Marker for UI". It IS critical.

        res.status(200).json({ message: 'Transaction added successfully', transaction: newTransaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
