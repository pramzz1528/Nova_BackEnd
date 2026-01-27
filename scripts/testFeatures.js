const axios = require('axios');

const API_URL = ' https://nova-frontend-new.web.app//api';

async function testFeatures() {
    try {
        // 1. Register/Login to get Token
        const userCreds = {
            username: 'feature_tester_' + Date.now(),
            email: 'feature_test_' + Date.now() + '@example.com',
            password: 'password123'
        };

        console.log('--- Registering ---');
        await axios.post(`${API_URL}/auth/register`, userCreds);

        console.log('--- Logging In ---');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: userCreds.email,
            password: userCreds.password
        });
        const token = loginRes.data.token;
        console.log('Got Token:', !!token);

        if (!token) throw new Error('No token received');

        const config = {
            headers: { 'x-auth-token': token }
        };

        // 2. Create Task
        console.log('\n--- Creating Task ---');
        const taskPayload = {
            title: 'Test Task',
            description: 'Testing task creation',
            priority: 'High',
            dueDate: new Date()
        };
        try {
            const taskRes = await axios.post(`${API_URL}/tasks`, taskPayload, config);
            console.log('Task Created:', taskRes.data.title);
        } catch (err) {
            console.error('Task Creation Failed:', err.response ? err.response.data : err.message);
        }

        // 3. Create Reminder
        console.log('\n--- Creating Reminder ---');
        const reminderPayload = {
            title: 'Test Reminder',
            time: new Date(),
            repeat: 'None',
            category: 'General'
        };
        try {
            const reminderRes = await axios.post(`${API_URL}/reminders`, reminderPayload, config);
            console.log('Reminder Created:', reminderRes.data.title);
        } catch (err) {
            console.error('Reminder Creation Failed:', err.response ? err.response.data : err.message);
        }

    } catch (err) {
        console.error('Feature Test Error:', err.response ? err.response.data : err.message);
    }
}

testFeatures();
