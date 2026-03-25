import { Router } from 'express';
import * as recordsController from '../controllers/recordsController.js';
import { requireDatabaseUrl } from '../middleware/requireDatabaseUrl.js';

const router = Router();

router.use(requireDatabaseUrl);

router.post('/', recordsController.postRecord);
router.get('/', recordsController.getRecords);
router.get('/:id', recordsController.getRecord);
router.put('/:id', recordsController.putRecord);
router.delete('/:id', recordsController.removeRecord);

export default router;
