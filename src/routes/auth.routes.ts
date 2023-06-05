import express from 'express';
import * as authenticationController from '../controllers/authentication.controller';
const router = express.Router();

router.post('/login', authenticationController.loginUser);
router.post('/authenticate', authenticationController.authenticateUser);

export default router;
