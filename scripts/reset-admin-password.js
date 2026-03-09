const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Schema Definition (matches src/models/User.js roughly)
const UserSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function connectDB() {
    let mongoURI = 'mongodb://localhost:27017/arshi-sales';
    try {
        const envPath = path.join(__dirname, '../.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf-8');
            const match = envConfig.split('\n').find(l => l.startsWith('MONGODB_URI'));
            if (match) {
                mongoURI = match.substring(match.indexOf('=') + 1).trim();
                if ((mongoURI.startsWith('"') && mongoURI.endsWith('"')) || (mongoURI.startsWith("'") && mongoURI.endsWith("'"))) {
                    mongoURI = mongoURI.slice(1, -1);
                }
            }
        }
    } catch (e) {
        console.log('Could not read .env.local, using default');
    }

    console.log(`Connecting to DB...`);
    await mongoose.connect(mongoURI);
}

async function resetAdmin() {
    try {
        await connectDB();

        const email = 'admin@arshisales.com';
        const password = 'adminpassword123';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`Resetting password for ${email}...`);

        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            {
                $set: {
                    password: hashedPassword,
                    role: 'admin',
                    name: 'Admin User'
                }
            },
            { new: true, upsert: true }
        );

        console.log('Admin password reset successfully.');
        console.log('Email:', email);
        console.log('Password:', password);

        process.exit(0);
    } catch (error) {
        console.error('Reset failed:', error);
        process.exit(1);
    }
}

resetAdmin();
