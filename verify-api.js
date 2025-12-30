// const fetch = require('node-fetch');
// Actually, let's use standard http module to avoid dependencies if possible, or just assume fetch is available in node 18+
// If node version is old, this might fail. Let's use http.

const http = require('http');

const data = JSON.stringify({
    userId: null,
    items: [],
    total: 100
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/orders/create',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
