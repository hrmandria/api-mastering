import express from 'express';
import * as registrationController from '../controllers/registration.controller';

const router = express.Router();
router.post('/register', registrationController.registerUser);

export default router;