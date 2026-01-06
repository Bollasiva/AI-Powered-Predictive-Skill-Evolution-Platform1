import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill {
    skillName: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    skills: ISkill[];
    createdAt: Date;
    updatedAt: Date;
}

const SkillSchema: Schema = new Schema({
    skillName: { type: String, required: true, trim: true },
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true }
});

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: [SkillSchema]
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;