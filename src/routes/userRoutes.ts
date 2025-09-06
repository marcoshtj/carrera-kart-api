import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createUserSchema, updateUserSchema, loginSchema } from '../utils/userValidation';
import { UserRole } from '../types/user.types';

const router = Router();
const userController = new UserController();

// Rotas públicas
router.post(
  '/login',
  validate(loginSchema),
  userController.login.bind(userController)
);

// Rotas protegidas
router.use(authenticate);

// Rotas para usuário autenticado
router.get(
  '/profile',
  userController.getProfile.bind(userController)
);

router.put(
  '/profile',
  validate(updateUserSchema),
  userController.updateProfile.bind(userController)
);

// Rotas apenas para ADMIN
router.post(
  '/',
  authorize(UserRole.ADMIN),
  validate(createUserSchema),
  userController.createUser.bind(userController)
);

router.get(
  '/',
  authorize(UserRole.ADMIN),
  userController.getAllUsers.bind(userController)
);

router.get(
  '/:id',
  authorize(UserRole.ADMIN),
  userController.getUserById.bind(userController)
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN),
  validate(updateUserSchema),
  userController.updateUser.bind(userController)
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  userController.deleteUser.bind(userController)
);

export default router;
