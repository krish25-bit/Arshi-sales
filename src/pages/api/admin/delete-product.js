import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const result = await Product.deleteOne({ id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
