import fs from 'fs';
import path from 'path';

function getDataFilePath() {
    return path.join(process.cwd(), 'data', 'store.json');
}

function ensureDataFile() {
    const filePath = getDataFilePath();
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
        const initialData = {
            users: [],
            orders: [],
            products: [
                { id: 1, name: 'Premium Tobacco', price: 500, description: 'High quality cured tobacco leaves.', image: '/images/tobacco.jpg' },
                { id: 2, name: 'Babu Special', price: 150, description: 'Our signature blend, loved by many.', image: '/images/babu.jpg' },
                { id: 3, name: 'Traditional Bidi', price: 1, description: 'Hand-rolled traditional bidi bundle.', image: '/images/bidi.jpg' },
                { id: 4, name: 'Menthol Burst', price: 200, description: 'Refreshing menthol flavor.', image: '/images/menthol.jpg' },
            ]
        };
        fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
    }
}

export function readData() {
    ensureDataFile();
    const filePath = getDataFilePath();
    const fileData = fs.readFileSync(filePath);
    return JSON.parse(fileData);
}

export function writeData(data) {
    ensureDataFile();
    const filePath = getDataFilePath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function calculatePendingDues(userId, orders) {
    if (!userId || userId === 'guest') return 0;

    return orders
        .filter(order => order.userId === userId && order.paymentStatus === 'pending')
        .reduce((sum, order) => sum + (order.total || 0), 0);
}
