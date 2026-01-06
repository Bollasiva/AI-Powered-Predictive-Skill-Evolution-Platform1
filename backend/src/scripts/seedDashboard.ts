
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Trend from '../models/Trend';
import Forecast from '../models/Forecast';
import connectDB from '../config/db';

dotenv.config();

const seedDashboardData = async () => {
    try {
        await connectDB();

        console.log('🧹 Clearing existing dashboard data...');
        await Trend.deleteMany({});
        await Forecast.deleteMany({});

        const trendsData = {
            _id: 'skill_historical_trends',
            trends: [
                {
                    skill: 'python',
                    history: [
                        { year: 2019, demand_score: 82 },
                        { year: 2020, demand_score: 85 },
                        { year: 2021, demand_score: 88 },
                        { year: 2022, demand_score: 92 },
                        { year: 2023, demand_score: 95 }
                    ]
                },
                {
                    skill: 'javascript',
                    history: [
                        { year: 2019, demand_score: 90 },
                        { year: 2020, demand_score: 91 },
                        { year: 2021, demand_score: 93 },
                        { year: 2022, demand_score: 94 },
                        { year: 2023, demand_score: 96 }
                    ]
                },
                {
                    skill: 'react',
                    history: [
                        { year: 2019, demand_score: 75 },
                        { year: 2020, demand_score: 80 },
                        { year: 2021, demand_score: 85 },
                        { year: 2022, demand_score: 89 },
                        { year: 2023, demand_score: 93 }
                    ]
                },
                {
                    skill: 'machine_learning',
                    history: [
                        { year: 2019, demand_score: 70 },
                        { year: 2020, demand_score: 76 },
                        { year: 2021, demand_score: 84 },
                        { year: 2022, demand_score: 89 },
                        { year: 2023, demand_score: 96 }
                    ]
                }
            ]
        };

        const forecastsData = {
            _id: 'skill_forecasts',
            forecasts: [
                {
                    skill: 'python',
                    forecast: [
                        { year: 2024, demand_score: 96 },
                        { year: 2025, demand_score: 97 },
                        { year: 2026, demand_score: 98 }
                    ]
                },
                {
                    skill: 'javascript',
                    forecast: [
                        { year: 2024, demand_score: 95 },
                        { year: 2025, demand_score: 95 },
                        { year: 2026, demand_score: 94 }
                    ]
                },
                {
                    skill: 'react',
                    forecast: [
                        { year: 2024, demand_score: 94 },
                        { year: 2025, demand_score: 96 },
                        { year: 2026, demand_score: 97 }
                    ]
                },
                {
                    skill: 'machine_learning',
                    forecast: [
                        { year: 2024, demand_score: 97 },
                        { year: 2025, demand_score: 98 },
                        { year: 2026, demand_score: 99 }
                    ]
                }
            ]
        };

        console.log('🌱 Seeding Trends...');
        await Trend.create(trendsData);

        console.log('🌱 Seeding Forecasts...');
        await Forecast.create(forecastsData);

        console.log('✅ Dashboard Data Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedDashboardData();
