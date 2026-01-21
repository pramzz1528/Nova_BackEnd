const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/health',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`Health Check Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Health Response:', data);
        testRegister();
    });
});

req.on('error', (error) => {
    console.error('Health Check Error: Server might not be running!', error.message);
});

req.end();

function testRegister() {
    const postData = JSON.stringify({
        username: 'api_test_user',
        email: 'api_test@example.com',
        password: 'password123'
    });

    const regOptions = {
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const regReq = http.request(regOptions, (res) => {
        console.log(`Register Status: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('Register Response:', data);
        });
    });

    regReq.on('error', (error) => {
        console.error('Register Error:', error.message);
    });

    regReq.write(postData);
    regReq.end();
}
