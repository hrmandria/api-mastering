import express from 'express';
import * as userController from '../controllers/user.controller';

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/authenticate', userController.authenticateUser);

export default router;
