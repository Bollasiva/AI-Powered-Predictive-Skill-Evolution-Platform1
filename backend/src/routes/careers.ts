import express, { Router, Request, Response } from 'express';
import careerPaths from '../data/careerPaths';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const careerNames = Object.keys(careerPaths);
    res.json(careerNames);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;