/**
 * Vehicle routes
 * Defines inventory endpoints for vehicles and stock management
 */

import { Router } from 'express';
import vehicleController from '../controllers/vehicleController';

const router = Router();

router.post('/', vehicleController.create);
router.get('/', vehicleController.getAll);
router.get('/search', vehicleController.search);
router.put('/:id', vehicleController.update);
router.delete('/:id', vehicleController.delete);
router.post('/:id/purchase', vehicleController.purchase);
router.post('/:id/restock', vehicleController.restock);

export default router;
