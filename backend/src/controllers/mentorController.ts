import { Request, Response } from 'express';
import { getMentorChatResponse } from '../services/aiService';

export const getChatResponse = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ msg: 'Message is required' });
    }

    const data = await getMentorChatResponse(message, history || []);
    res.json(data);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
