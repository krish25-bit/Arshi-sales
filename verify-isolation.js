const { calculatePendingDues } = require('./src/pages/api/data');

// Mock data
const mockOrders = [
    { id: '1', userId: 'user1', total: 100, paymentStatus: 'pending' },
    { id: '2', userId: 'user2', total: 500, paymentStatus: 'pending' },
    { id: '3', userId: 'user1', total: 50, paymentStatus: 'paid' },
];

console.log('Testing Data Isolation...');

// Test User 1
const dues1 = calculatePendingDues('user1', mockOrders);
console.log(`User 1 Dues (Expected 100): ${dues1}`);

// Test User 2
const dues2 = calculatePendingDues('user2', mockOrders);
console.log(`User 2 Dues (Expected 500): ${dues2}`);

// Test User 3 (No orders)
const dues3 = calculatePendingDues('user3', mockOrders);
console.log(`User 3 Dues (Expected 0): ${dues3}`);

if (dues1 === 100 && dues2 === 500 && dues3 === 0) {
    console.log('PASS: Data is correctly isolated.');
} else {
    console.log('FAIL: Data isolation check failed.');
}
