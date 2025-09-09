import express from 'express';
import { OperatingHourController } from '../controllers/OperatingHourController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types/user.types';

const router = express.Router();
const operatingHourController = new OperatingHourController();

/**
 * @route   GET /api/v1/operating-hours
 * @desc    Obter todos os horários de funcionamento agrupados
 * @access  Public
 */
router.get('/', operatingHourController.getAll);

/**
 * @route   GET /api/v1/operating-hours/visible
 * @desc    Obter horários de funcionamento visíveis agrupados
 * @access  Public
 */
router.get('/visible', operatingHourController.getVisible);

/**
 * @route   GET /api/v1/operating-hours/group/:group
 * @desc    Obter horários de funcionamento por grupo (header ou footer)
 * @access  Public
 */
router.get('/group/:group', operatingHourController.getByGroup);

/**
 * @route   PUT /api/v1/operating-hours/bulk-update
 * @desc    Atualizar múltiplos horários de funcionamento
 * @access  Private (Admin only)
 */
router.put('/bulk-update', authenticate, authorize(UserRole.ADMIN), operatingHourController.bulkUpdate);

/**
 * @route   GET /api/v1/operating-hours/:id
 * @desc    Obter horário de funcionamento por ID
 * @access  Public
 */
router.get('/:id', operatingHourController.getById);

/**
 * @route   PUT /api/v1/operating-hours/:id
 * @desc    Atualizar horário de funcionamento
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, authorize(UserRole.ADMIN), operatingHourController.update);

/**
 * @route   PATCH /api/v1/operating-hours/:id/visibility
 * @desc    Alternar visibilidade do horário de funcionamento
 * @access  Private (Admin only)
 */
router.patch('/:id/visibility', authenticate, authorize(UserRole.ADMIN), operatingHourController.toggleVisibility);

export { router as operatingHourRoutes };
