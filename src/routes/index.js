import { Router } from 'express';
import { healthRouter } from './health.js';
import { transcriptionRouter } from './transcription.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/transcribe', transcriptionRouter);

export { router };