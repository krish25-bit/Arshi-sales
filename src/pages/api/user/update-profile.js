import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId, phone } = req.body;

    if (!userId || !phone) {
        return res.status(400).json({ message: 'User ID and Phone Number are required' });
    }

    await dbConnect();

    try {
        const user = await User.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update phone
        user.phone = phone;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
