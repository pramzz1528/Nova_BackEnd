const axios = require('axios');

const API_URL = 'https://nova-frontend-new.web.app/api/auth';

async function testLogin() {
    const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
    };

    console.log('--- Starting Login Reproduction Test ---');

    try {
        // 1. Register
        console.log(`\n1. Registering user: ${testUser.username}`);
        await axios.post(`${API_URL}/register`, testUser);
        console.log('   Registration successful.');

        // 2. Login with CORRECT password
        console.log('\n2. Logging in with CORRECT password...');
        try {
            const loginRes = await axios.post(`${API_URL}/login`, {
                email: testUser.email,
                password: testUser.password
            });
            console.log('   Login successful (Expected). Token received:', !!loginRes.data.token);
        } catch (err) {
            console.error('   Login FAILED (Unexpected):', err.response ? err.response.data : err.message);
        }

        // 3. Login with INCORRECT password
        console.log('\n3. Logging in with INCORRECT password (should fail)...');
        try {
            await axios.post(`${API_URL}/login`, {
                email: testUser.email,
                password: 'wrongpassword'
            });
            console.error('   Login SUCCESSFUL (FAILURE: Should have been rejected!)');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.log('   Login failed as expected (Success). Msg:', err.response.data.msg);
            } else {
                console.error('   Login failed with unexpected error:', err.response ? err.response.data : err.message);
            }
        }

        // 4. Register with SHORT password (should fail)
        console.log('\n4. Registering with SHORT password (should fail)...');
        try {
            await axios.post(`${API_URL}/register`, {
                username: `short_${Date.now()}`,
                email: `short_${Date.now()}@example.com`,
                password: '123'
            });
            console.error('   Registration SUCCESSFUL (FAILURE: Should have been rejected!)');
        } catch (err) {
            if (err.response && err.response.status === 400) {
                console.log('   Registration failed as expected (Success). Msg:', err.response.data.msg);
            } else {
                console.error('   Registration failed with unexpected error:', err.response ? err.response.data : err.message); // If server not running, this will catch.
            }
        }

    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.error('\nERROR: Could not connect to backend. Is the server running on port 5001?');
        } else {
            console.error('\nERROR:', err.message);
            if (err.response) console.error('Data:', err.response.data);
        }
    }
}

testLogin();
