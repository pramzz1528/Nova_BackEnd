const Reminder = require('../models/Reminder');

// @route   GET api/reminders
// @desc    Get all user reminders
// @access  Private
exports.getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user.id }).sort({ time: 1 });
        res.json(reminders);
    } catch (err) {
        console.error('Fetch Reminders Error:', err.message);
        res.status(500).json({ msg: 'Server error while fetching reminders', error: err.message });
    }
};

// @route   POST api/reminders
// @desc    Create a reminder
// @access  Private
exports.createReminder = async (req, res) => {
    console.log('[DEBUG] createReminder Request:', { body: req.body, user: req.user.id });
    const { title, time, repeat, category } = req.body;

    if (!title || !time) {
        return res.status(400).json({ msg: 'Title and time are required' });
    }

    try {
        const newReminder = new Reminder({
            user: req.user.id,
            title,
            time,
            repeat,
            category
        });

        const reminder = await newReminder.save();
        res.json(reminder);
    } catch (err) {
        console.error('Create Reminder Error:', err.message);
        res.status(500).json({ msg: 'Server error while creating reminder', error: err.message });
    }
};

// @route   PUT api/reminders/:id
// @desc    Update a reminder
// @access  Private
exports.updateReminder = async (req, res) => {
    const { title, time, repeat, isCompleted } = req.body;

    try {
        let reminder = await Reminder.findById(req.params.id);
        if (!reminder) return res.status(404).json({ msg: 'Reminder not found' });
        if (reminder.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        reminder.title = title || reminder.title;
        reminder.time = time || reminder.time;
        reminder.repeat = repeat || reminder.repeat;
        reminder.isCompleted = isCompleted !== undefined ? isCompleted : reminder.isCompleted;

        await reminder.save();
        res.json(reminder);
    } catch (err) {
        console.error('Update Reminder Error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Reminder not found (Invalid ID)' });
        }
        res.status(500).json({ msg: 'Server error while updating reminder', error: err.message });
    }
};

// @route   DELETE api/reminders/:id
// @desc    Delete a reminder
// @access  Private
exports.deleteReminder = async (req, res) => {
    try {
        let reminder = await Reminder.findById(req.params.id);
        if (!reminder) return res.status(404).json({ msg: 'Reminder not found' });
        if (reminder.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await reminder.deleteOne();
        res.json({ msg: 'Reminder removed' });
    } catch (err) {
        console.error('Delete Reminder Error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Reminder not found (Invalid ID)' });
        }
        res.status(500).json({ msg: 'Server error while deleting reminder', error: err.message });
    }
};
