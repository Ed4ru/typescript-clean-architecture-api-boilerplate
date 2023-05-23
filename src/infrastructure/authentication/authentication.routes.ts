import express from 'express';

import { validate } from '@/infrastructure/server/middlewares/validation.middleware';
import { requireAuthentication } from '@/infrastructure/server/middlewares/requireAuthentication.middleware';

import { loginSchema } from '@/infrastructure/authentication/schemas/login.schema';
import { registerSchema } from '@/infrastructure/authentication/schemas/register.schema';
import { resetPasswordSchema } from '@/infrastructure/authentication/schemas/resetPassword.schema';
import { setNewPasswordSchema } from '@/infrastructure/authentication/schemas/setNewPassword.schema';

import { loginController } from '@/infrastructure/authentication/controllers/login.controller';
import { registerController } from '@/infrastructure/authentication/controllers/register.controller';
import { logoutController } from '@/infrastructure/authentication/controllers/logout.controller';
import { retrieveSessionController } from '@/infrastructure/authentication/controllers/retrieveSession.controller';
import { resetPasswordController } from '@/infrastructure/authentication/controllers/resetPassword.controller';
import { setNewPasswordController } from '@/infrastructure/authentication/controllers/setNewPassword.controller';

const router = express.Router();

router.post('/login', validate(loginSchema), loginController);
router.post('/register', validate(registerSchema), registerController);
router.post('/logout', requireAuthentication, logoutController);
router.get(
  '/retrieve-session',
  requireAuthentication,
  retrieveSessionController
);
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  resetPasswordController
);
router.post(
  '/:userId/set-new-password/:token',
  validate(setNewPasswordSchema),
  setNewPasswordController
);

export { router as authenticationRoutes };
