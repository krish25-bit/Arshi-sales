const http = require('http');

http.get('http://localhost:3000/api/admin/get-all', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const user = json.users[0];
            if (user.password) {
                console.log('FAIL: Password field found!');
            } else {
                console.log('PASS: Password field NOT found.');
                console.log('User keys:', Object.keys(user));
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
