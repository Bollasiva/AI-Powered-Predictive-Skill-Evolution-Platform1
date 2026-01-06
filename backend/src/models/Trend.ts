import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPoint {
    year: number;
    demand_score: number;
}

export interface ISkillTrend {
    skill: string;
    history: IPoint[];
}

export interface ITrend extends Document {
    _id: string;
    trends: ISkillTrend[];
    last_updated: Date;
}

const PointSchema: Schema = new Schema({
    year: { type: Number, required: true },
    demand_score: { type: Number, required: true }
}, { _id: false });

const SkillTrendSchema: Schema = new Schema({
    skill: { type: String, required: true },
    history: [PointSchema]
}, { _id: false });

const TrendSchema: Schema = new Schema({
    _id: { type: String, required: true },
    trends: [SkillTrendSchema],
    last_updated: { type: Date, default: Date.now }
});

const Trend: Model<ITrend> = mongoose.models.Trend || mongoose.model<ITrend>('Trend', TrendSchema);
export default Trend;