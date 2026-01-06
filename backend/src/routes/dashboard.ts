import express, { Router, Request, Response } from 'express';
import auth from '../middleware/authMiddleware';
import Trend from '../models/Trend';
import Forecast from '../models/Forecast';

const router: Router = express.Router();

router.get('/trends', auth, async (req: Request, res: Response) => {
  try {
    const [trendsData, forecastsData] = await Promise.all([
      Trend.findById('skill_historical_trends'),
      Forecast.findById('skill_forecasts')
    ]);

    if (!trendsData || !forecastsData) {
      return res.json([]); // Return empty list instead of 404
    }

    const combinedData = trendsData.trends.map((trend: any) => {
      const forecast = forecastsData.forecasts.find((f: any) => f.skill === trend.skill);
      return {
        skill: trend.skill,
        history: trend.history,
        forecast: forecast ? forecast.forecast : []
      };
    });

    res.json(combinedData);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;