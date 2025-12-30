const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataFilePath = path.join(__dirname, 'data', 'store.json');

if (!fs.existsSync(dataFilePath)) {
    console.error('Data file not found!');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataFilePath));

const adminEmail = 'admin@arshisales.com';
const adminPassword = 'adminpassword123';
const hashedPassword = bcrypt.hashSync(adminPassword, 10);

// Check if admin already exists
const existingAdmin = data.users.find(u => u.email === adminEmail);

if (existingAdmin) {
    console.log('Admin user already exists.');
    existingAdmin.password = hashedPassword; // Update password just in case
    existingAdmin.role = 'admin';
} else {
    const newAdmin = {
        id: 'admin-1',
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        phone: '0000000000',
        role: 'admin',
        createdAt: new Date().toISOString()
    };
    data.users.push(newAdmin);
    console.log('Admin user created.');
}

fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
console.log(`Admin Login: ${adminEmail} / ${adminPassword}`);
