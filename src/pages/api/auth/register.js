import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();

    // Rate Limiting: 5 attempts per Hour by IP for registration to prevent spam
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { checkRateLimit } = require('../../../lib/rateLimit');

    if (!checkRateLimit(ip, 5, 60 * 60 * 1000)) {
        return res.status(429).json({ message: 'Too many registration attempts. Please try again later.' });
    }

    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await User.create({
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'user',
            createdAt: new Date()
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
