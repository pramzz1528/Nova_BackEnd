const Automation = require('../models/Automation');

// @route   POST api/automations
// @desc    Create an automation
// @access  Private
exports.createAutomation = async (req, res) => {
    const { name, triggerType, schedule, condition, action } = req.body;

    try {
        const newAutomation = new Automation({
            user: req.user.id,
            name,
            triggerType,
            schedule,
            condition,
            action
        });

        const automation = await newAutomation.save();
        res.json(automation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/automations
// @desc    Get all automations
// @access  Private
exports.getAutomations = async (req, res) => {
    try {
        const automations = await Automation.find({ user: req.user.id });
        res.json(automations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
