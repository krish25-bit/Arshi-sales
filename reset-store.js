const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const filePath = path.join(__dirname, 'data', 'store.json');

// Generate hash for "password123"
const password = "password123";
const hash = bcrypt.hashSync(password, 10);

console.log(`Generated hash for '${password}': ${hash}`);

const data = {
    "users": [
        {
            "id": "admin-1",
            "name": "Admin User",
            "email": "admin@arshisales.com",
            "password": hash,
            "phone": "0000000000",
            "role": "admin",
            "createdAt": new Date().toISOString()
        },
        {
            "id": "user-1",
            "name": "Test User",
            "email": "user@example.com",
            "password": hash,
            "phone": "1234567890",
            "role": "user",
            "createdAt": new Date().toISOString()
        }
    ],
    "orders": [],
    "products": [
        {
            "id": 1,
            "name": "Premium Tobacco",
            "price": 500,
            "description": "High quality cured tobacco leaves.",
            "image": "/images/baghban_138.jpg"
        },
        {
            "id": 2,
            "name": "Babu Special",
            "price": 150,
            "description": "Our signature blend, loved by many.",
            "image": "/images/babu.jpg"
        },
        {
            "id": 3,
            "name": "Traditional Bidi",
            "price": 1,
            "description": "Hand-rolled traditional bidi bundle.",
            "image": "/images/bidi.jpg"
        },
        {
            "id": 4,
            "name": "Menthol Burst",
            "price": 200,
            "description": "Refreshing menthol flavor.",
            "image": "/images/menthol.jpg"
        }
    ]
};

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('store.json has been reset with verified data.');
