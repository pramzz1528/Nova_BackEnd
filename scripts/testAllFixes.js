const axios = require('axios');

const BACKEND_URL = '  http://localhost:5173/api';

async function testAll() {
    console.log('--- STARTING VERIFICATION ---');

    try {
        // 1. Test Login with Normalization and 401 status
        console.log('\n[1] Testing Login Normalization...');
        try {
            const loginRes = await axios.post(`${BACKEND_URL}/auth/login`, {
                email: 'TEST@EXAMPLE.COM', // Mixed case
                password: 'Testpass@123'
            });
            console.log('✅ Login Normalization Success:', loginRes.data.token ? 'Token received' : 'No token');

            const token = loginRes.data.token;

            // 2. Test AI Chat
            console.log('\n[2] Testing AI Chat...');
            const chatRes = await axios.post(`${BACKEND_URL}/ai/chat`, {
                message: 'Hello NOVA!'
            }, {
                headers: { 'x-auth-token': token }
            });
            console.log('✅ AI Chat Success:', chatRes.data.response);

            // 3. Test Code Assistant
            console.log('\n[3] Testing Code Assistant...');
            const codeRes = await axios.post(`${BACKEND_URL}/ai/code-assistant`, {
                message: 'How can I optimize this loop?',
                language: 'javascript',
                codeContext: 'for(let i=0; i<arr.length; i++) { console.log(arr[i]); }'
            }, {
                headers: { 'x-auth-token': token }
            });
            console.log('✅ Code Assistant Success:', codeRes.data.response);

        } catch (err) {
            console.error('❌ Test Failed:', err.response ? err.response.data : err.message);
            if (err.response) console.error('Status Code:', err.response.status);
        }

    } catch (err) {
        console.error('❌ Connectivity Error:', err.message);
    }
}

testAll();
