const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    skillName: { type: String, required: true, trim: true },
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true }
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: [SkillSchema]
}, { timestamps: true });

// FIX: Check if model exists before compiling
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);