const axios = require('axios');

async function registerTestUser() {
    try {
        const res = await axios.post(' http://localhost:5173/api/auth/register', {
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
