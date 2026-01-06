import { Request, Response } from 'express';
import { getRealTimeJobs } from '../services/aiService';

export const getJobs = async (req: Request, res: Response) => {
    try {
        const { skill, location } = req.query;

        if (!skill) {
            return res.status(400).json({ msg: 'Skill parameter is required' });
        }

        const jobs = await getRealTimeJobs(skill as string, location as string);
        res.json(jobs);
    } catch (err: any) {
        console.error('Job Controller Error:', err);
        res.status(500).send('Server Error');
    }
};
