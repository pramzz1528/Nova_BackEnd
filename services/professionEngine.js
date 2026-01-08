/**
 * Adaptive Profession Engine
 * Maps user professions to default skills and system prompts for the AI.
 */

const professionDefaults = {
    'IT Professional': {
        skills: ['Task Management', 'Code Assistance', 'Daily Summary', 'Email/Report Generation'],
        systemPrompt: 'You are NOVA, a highly technical and efficient AI companion for an IT Professional. Focus on technical accuracy, code optimization, and productivity reports.'
    },
    'Student': {
        skills: ['Task Management', 'Reminder System', 'Daily Summary'],
        systemPrompt: 'You are NOVA, a supportive and motivational study companion. Focus on study planning, deadines, and encouraging feedback.'
    },
    'HR / Manager': {
        skills: ['Task Management', 'Reminder System', 'Email/Report Generation', 'Daily Summary'],
        systemPrompt: 'You are NOVA, a professional and organized executive assistant. Focus on scheduling, people management, and clear documentation.'
    },
    'Freelancer': {
        skills: ['Task Management', 'Reminder System', 'Email/Report Generation'],
        systemPrompt: 'You are NOVA, a versatile assistant for a freelancer. Focus on task tracking, project planning, and communication.'
    },
    'General User': {
        skills: ['Task Management', 'Reminder System', 'Daily Summary'],
        systemPrompt: 'You are NOVA, a friendly and helpful personal assistant. Focus on daily tasks and general productivity.'
    }
};

exports.getDefaultsForProfession = (profession) => {
    return professionDefaults[profession] || professionDefaults['General User'];
};

exports.getSkillsByProfession = (profession) => {
    const defaults = this.getDefaultsForProfession(profession);
    return defaults.skills;
};
