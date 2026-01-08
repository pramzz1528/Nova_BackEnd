const User = require('../models/User');
const professionEngine = require('../services/professionEngine');

// @route   POST api/skills/toggle
// @desc    Enable or disable a skill
// @access  Private
exports.toggleSkill = async (req, res) => {
    const { skillName, enable } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (enable) {
            if (!user.enabledSkills.includes(skillName)) {
                user.enabledSkills.push(skillName);
            }
        } else {
            user.enabledSkills = user.enabledSkills.filter(s => s !== skillName);
        }

        await user.save();
        res.json(user.enabledSkills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/skills/available
// @desc    Get skills relevant to user's profession
// @access  Private
exports.getRelevantSkills = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const skills = professionEngine.getSkillsByProfession(user.profession);
        res.json(skills);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
