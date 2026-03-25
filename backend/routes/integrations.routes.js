import { Router } from 'express';
import * as youtubeController from '../controllers/youtubeController.js';

const router = Router();

router.get('/youtube', youtubeController.getYoutubeVideos);

export default router;
