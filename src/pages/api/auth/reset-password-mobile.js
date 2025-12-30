import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    await dbConnect();

    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify OTP
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user
        user.password = hashedPassword;
        user.otp = undefined; // Clear OTP
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful! You can now login.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
