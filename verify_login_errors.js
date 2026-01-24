const http = require('http');

function postRequest(email, password, expectedError, testName) {
    const postData = JSON.stringify({ email, password });
    const options = {
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log(`[${testName}] Status: ${res.statusCode}`);
            console.log(`[${testName}] Body: ${data}`);
            if (data.includes(expectedError)) {
                console.log(`[${testName}] PASS - Found: "${expectedError}"`);
            } else {
                console.log(`[${testName}] FAIL - Expected: "${expectedError}", Got: ${data}`);
            }
        });
    });

    req.on('error', (e) => console.error(`[${testName}] Error:`, e.message));
    req.write(postData);
    req.end();
}

// 1. Valid user, Wrong password
setTimeout(() => {
    postRequest('api_test@example.com', 'WRONG_PASSWORD_123', 'Incorrect password', 'TestWrongPass');
}, 3000);

// 2. Non-existent user
setTimeout(() => {
    postRequest('fails@example.com', 'anypass', 'User not found', 'TestNoUser');
}, 3000);
