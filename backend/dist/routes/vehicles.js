"use strict";
/**
 * Vehicle routes
 * Defines inventory endpoints for vehicles and stock management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicleController_1 = __importDefault(require("../controllers/vehicleController"));
const router = (0, express_1.Router)();
router.post('/', vehicleController_1.default.create);
router.get('/', vehicleController_1.default.getAll);
router.get('/search', vehicleController_1.default.search);
router.put('/:id', vehicleController_1.default.update);
router.delete('/:id', vehicleController_1.default.delete);
router.post('/:id/purchase', vehicleController_1.default.purchase);
router.post('/:id/restock', vehicleController_1.default.restock);
exports.default = router;
