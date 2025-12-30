const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arshi-sales';

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const adminEmail = 'admin@arshisales.com';
    const adminPassword = 'adminpassword123';
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
        console.log('Admin user already exists.');
        existingAdmin.password = hashedPassword;
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Admin password updated.');
    } else {
        await User.create({
            id: 'admin-1',
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            phone: '0000000000',
            role: 'admin',
            createdAt: new Date()
        });
        console.log('Admin user created.');
    }

    console.log(`Admin Login: ${adminEmail} / ${adminPassword}`);
    process.exit(0);
}

createAdmin().catch(err => {
    console.error(err);
    process.exit(1);
});
