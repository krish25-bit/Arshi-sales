import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    // Rate Limiting: 5 attempts per 15 minutes by IP
    // Note: In Next.js API routes on some platforms, req.headers['x-forwarded-for'] or req.socket.remoteAddress
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { checkRateLimit } = require('../../../lib/rateLimit'); // Dynamic import or require inside handler

    if (!checkRateLimit(ip, 5, 15 * 60 * 1000)) {
        return res.status(429).json({ message: 'Too many login attempts. Please try again later.' });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        console.log("Login attempt:", { email, isMatch });

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Return user without password
        const userObj = user.toObject();
        const { password: _, ...userWithoutPassword } = userObj;

        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
