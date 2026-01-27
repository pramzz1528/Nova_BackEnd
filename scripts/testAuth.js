const axios = require('axios');

const API_URL = ' https://nova-frontend-new.web.app//api/auth';

async function testAuth() {
    const testUser = {
        username: 'testuser_' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'password123'
    };

    try {
        console.log('--- Testing Registration ---');
        const regRes = await axios.post(`${API_URL}/register`, testUser);
        console.log('Registration Response:', regRes.data.msg);

        console.log('\n--- Testing Login ---');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('Login Success! Token received:', !!loginRes.data.token);

        console.log('\n--- Testing Login with Wrong Password ---');
        try {
            await axios.post(`${API_URL}/login`, {
                email: testUser.email,
                password: 'wrongpassword'
            });
        } catch (err) {
            console.log('Correctly caught wrong password:', err.response.data.msg);
        }

        console.log('\n--- Testing Registration with Short Password ---');
        try {
            await axios.post(`${API_URL}/register`, {
                username: 'shortpass',
                email: 'short@example.com',
                password: '123'
            });
        } catch (err) {
            console.log('Correctly caught short password:', err.response.data.msg);
        }

    } catch (err) {
        console.error('Test Failed:', err.response ? err.response.data : err.message);
    }
}

testAuth();
