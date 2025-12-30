import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    customerDetails: {
        name: String,
        email: String,
    },
    items: [
        {
            id: Number,
            name: String,
            price: Number,
            description: String,
            image: String,
            quantity: Number,
            updatedPrice: Number, // Admin override for specific item price
        },
    ],
    subtotal: Number,
    previousPendingAmount: Number,
    total: Number,
    paymentMethod: String,
    transactionId: String,
    paymentStatus: {
        type: String,
        default: 'pending',
    },
    status: {
        type: String,
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    type: String, // 'manual' or undefined

    // Admin Overrides
    manualDiscount: { type: Number, default: 0 },
    finalTotal: Number, // Stores the final price after admin adjustment
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
