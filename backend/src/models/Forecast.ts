import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPoint } from './Trend';

export interface ISkillForecast {
    skill: string;
    forecast: IPoint[];
}

export interface IForecast extends Document {
    _id: string;
    forecasts: ISkillForecast[];
    last_updated: Date;
}

const PointSchema: Schema = new Schema({
    year: { type: Number, required: true },
    demand_score: { type: Number, required: true }
}, { _id: false });

const SkillForecastSchema: Schema = new Schema({
    skill: { type: String, required: true },
    forecast: [PointSchema]
}, { _id: false });

const ForecastSchema: Schema = new Schema({
    _id: { type: String, required: true },
    forecasts: [SkillForecastSchema],
    last_updated: { type: Date, default: Date.now }
});

const Forecast: Model<IForecast> = mongoose.models.Forecast || mongoose.model<IForecast>('Forecast', ForecastSchema);
export default Forecast;