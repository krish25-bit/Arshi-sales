import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required' });
    }

    try {
        // Verify Google Token
        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const googleData = await googleRes.json();

        if (googleData.error || !googleData.email) {
            return res.status(400).json({ success: false, message: 'Invalid Google Token' });
        }

        const { email, name, picture, sub } = googleData;

        await dbConnect();

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not exists
            // Using 'sub' as ID or generating a new one? 
            // User model uses 'id' string. NextAuth usually uses random UUID or similar. 
            // We'll use the Google 'sub' (unique Google ID) as the ID, or a timestamp-based ID as seen in [...nextauth].js

            const newId = sub || Date.now().toString();

            user = await User.create({
                id: newId,
                name: name,
                email: email,
                image: picture,
                role: 'user', // Default role
                createdAt: new Date(),
            });
        }

        // Login successful
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Google Manual Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
