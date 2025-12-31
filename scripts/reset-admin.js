const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '../.env.local');
const envConfig = fs.readFileSync(envPath, 'utf-8');
const mongoURI = envConfig.split('\n').find(l => l.startsWith('MONGODB_URI')).split('=')[1].trim();

const UserSchema = new mongoose.Schema({
    id: String,
    email: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

async function reset() {
    await mongoose.connect(mongoURI);
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.findOneAndUpdate(
        { email: 'admin@arshisales.com' },
        {
            password: hashedPassword,
            role: 'admin',
            name: 'Admin User',
            id: 'admin-1'
        },
        { upsert: true, new: true }
    );
    console.log('Admin password reset to: admin123');
    process.exit(0);
}

reset().catch(console.error);
