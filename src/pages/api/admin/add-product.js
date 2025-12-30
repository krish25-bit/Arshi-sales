import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        const { name, price, description, image, category } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and Price are required' });
        }

        // Generate new ID (find max id + 1)
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const newId = lastProduct && lastProduct.id ? lastProduct.id + 1 : 1;

        const newProduct = await Product.create({
            id: newId,
            name,
            price: Number(price),
            description: description || '',
            image: image || '/images/placeholder.jpg',
            category: category || 'Uncategorized'
        });

        res.status(200).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
