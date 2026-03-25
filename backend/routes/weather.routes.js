import { Router } from 'express';
import * as weatherController from '../controllers/weatherController.js';

const router = Router();

router.get('/current', weatherController.getCurrent);
router.get('/forecast', weatherController.getForecast);

export default router;
