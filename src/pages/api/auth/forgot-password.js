import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // For security, do not reveal if email exists or not
            return res.status(200).json({ message: 'If an account exists with this email, a reset link has been sent.' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save token to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Mock sending email
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
        console.log('---------------------------------------------------');
        console.log(`PASSWORD RESET REQUEST FOR: ${email}`);
        console.log(`RESET LINK: ${resetLink}`);
        console.log('---------------------------------------------------');

        return res.status(200).json({ message: 'Reset link sent! Check the server console (simulated email).' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
