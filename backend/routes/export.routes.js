import { Router } from 'express';
import * as exportController from '../controllers/exportController.js';
import { requireDatabaseUrl } from '../middleware/requireDatabaseUrl.js';

const router = Router();

router.use(requireDatabaseUrl);

router.get('/json', exportController.exportJson);
router.get('/csv', exportController.exportCsv);

export default router;
