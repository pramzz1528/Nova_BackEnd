const axios = require('axios');

async function registerTestUser() {
    try {
        const res = await axios.post('https://nova-14cf3.web.appapi/auth/register', {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Testpass@123'
        });
        console.log('Registration Success:', res.data);
    } catch (err) {
        console.error('Registration Failed:', err.response ? err.response.data : err.message);
    }
}

registerTestUser();
