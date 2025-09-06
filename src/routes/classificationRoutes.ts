import { Router } from 'express';
import { ClassificationController } from '../controllers/ClassificationController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validation';
import { 
  createClassificationSchema, 
  updateClassificationSchema, 
  classificationQuerySchema,
  bulkUpdateClassificationsSchema
} from '../utils/classificationValidation';
import { UserRole } from '../types/user.types';

const router = Router();
const classificationController = new ClassificationController();

// Rotas públicas (para visualização)
router.get(
  '/leaderboard',
  classificationController.getLeaderboard.bind(classificationController)
);

router.get(
  '/category/:category',
  classificationController.getClassificationsByCategory.bind(classificationController)
);

router.get(
  '/',
  validateQuery(classificationQuerySchema),
  classificationController.getAllClassifications.bind(classificationController)
);

router.get(
  '/:id',
  classificationController.getClassificationById.bind(classificationController)
);

// Rotas protegidas (apenas para usuários autenticados)
router.use(authenticate);

// Rotas para ADMIN (CRUD completo)
router.post(
  '/',
  authorize(UserRole.ADMIN),
  validate(createClassificationSchema),
  classificationController.createClassification.bind(classificationController)
);

router.put(
  '/bulk',
  authorize(UserRole.ADMIN),
  validate(bulkUpdateClassificationsSchema),
  classificationController.bulkUpdateClassifications.bind(classificationController)
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(updateClassificationSchema),
  classificationController.updateClassification.bind(classificationController)
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  classificationController.deleteClassification.bind(classificationController)
);

export default router;
