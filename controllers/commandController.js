const Command = require('../models/Command');

// @route   POST api/commands
// @desc    Create a custom command
// @access  Private
exports.createCommand = async (req, res) => {
    const { trigger, actions } = req.body;

    if (!trigger || !actions || !Array.isArray(actions) || actions.length === 0) {
        return res.status(400).json({ msg: 'Trigger and at least one action are required' });
    }

    try {
        const newCommand = new Command({
            user: req.user.id,
            trigger,
            actions
        });

        const command = await newCommand.save();
        res.json(command);
    } catch (err) {
        console.error('Create Command Error:', err.message);
        res.status(500).json({ msg: 'Server error while creating command', error: err.message });
    }
};

// @route   GET api/commands
// @desc    Get all custom commands
// @access  Private
exports.getCommands = async (req, res) => {
    try {
        const commands = await Command.find({ user: req.user.id });
        res.json(commands);
    } catch (err) {
        console.error('Fetch Commands Error:', err.message);
        res.status(500).json({ msg: 'Server error while fetching commands', error: err.message });
    }
};

// @route   PUT api/commands/:id
// @desc    Update a custom command
// @access  Private
exports.updateCommand = async (req, res) => {
    const { trigger, actions, isActive } = req.body;

    try {
        let command = await Command.findById(req.params.id);
        if (!command) return res.status(404).json({ msg: 'Command not found' });
        if (command.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        command.trigger = trigger || command.trigger;
        command.actions = actions || command.actions;
        command.isActive = isActive !== undefined ? isActive : command.isActive;

        await command.save();
        res.json(command);
    } catch (err) {
        console.error('Update Command Error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Command not found (Invalid ID)' });
        }
        res.status(500).json({ msg: 'Server error while updating command', error: err.message });
    }
};

// @route   DELETE api/commands/:id
// @desc    Delete a custom command
// @access  Private
exports.deleteCommand = async (req, res) => {
    try {
        let command = await Command.findById(req.params.id);
        if (!command) return res.status(404).json({ msg: 'Command not found' });
        if (command.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await command.deleteOne();
        res.json({ msg: 'Command removed' });
    } catch (err) {
        console.error('Delete Command Error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Command not found (Invalid ID)' });
        }
        res.status(500).json({ msg: 'Server error while deleting command', error: err.message });
    }
};
