import { Router } from 'express';
import * as userCtrl from '../controllers/users.controller';
import { authJWT, verifySignUp } from '../middlewares';

const router = Router();

router.post(
  '/',
  [authJWT.verifyToken, authJWT.isAdmin, verifySignUp.checkRolesExisted],
  userCtrl.createUser
);

export default router;
