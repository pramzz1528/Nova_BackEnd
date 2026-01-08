const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const Automation = require('../models/Automation');

/**
 * Cron Service
 * Handles scheduled tasks for Reminders and Automations.
 */

const initCron = () => {
    // Check for reminders every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const reminders = await Reminder.find({
                time: { $lte: now },
                isCompleted: false
            });

            for (let reminder of reminders) {
                console.log(`[ALARM] Reminder triggered: ${reminder.title} for user ${reminder.user}`);
                // In a real app, send socket notification or push
                reminder.isCompleted = true;
                await reminder.save();
            }
        } catch (err) {
            console.error('Reminder cron error:', err);
        }
    });

    // Check for time-based automations every minute
    cron.schedule('* * * * *', async () => {
        try {
            // This is a simplified example. In a real app, we'd parse cron expressions from Automation model.
            const automations = await Automation.find({
                triggerType: 'Time',
                isActive: true
            });

            for (let auto of automations) {
                // logic to check if schedule matches 'now'
                // console.log(`[AUTO] Checking automation: ${auto.name}`);
            }
        } catch (err) {
            console.error('Automation cron error:', err);
        }
    });

    console.log('Cron Service Initialized...');
};

module.exports = initCron;
