import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        default: 'Uncategorized',
    },
    height: String,
    width: String,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
