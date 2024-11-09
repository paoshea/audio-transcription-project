import { Router } from 'express';
import { transcribeAudio } from '../services/transcription.js';

const transcriptionRouter = Router();

transcriptionRouter.post('/', async (req, res, next) => {
  try {
    const { audioUrl } = req.body;
    
    if (!audioUrl) {
      return res.status(400).json({ error: 'Audio URL is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const transcription = await transcribeAudio(audioUrl);
    res.json({ transcription });
  } catch (error) {
    next(error);
  }
});

export { transcriptionRouter };