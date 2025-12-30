import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    await dbConnect();

    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ message: 'User with this phone number not found' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // SIMULATE SENDING SMS
        console.log('================================================');
        console.log(`[SMS SIMULATION] To: ${phone}`);
        console.log(`[SMS SIMULATION] Message: Your OTP for Arshi Sales Password Reset is: ${otp}`);
        console.log('================================================');

        res.status(200).json({ success: true, message: 'OTP sent successfully to your mobile number!' });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
