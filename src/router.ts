import express from 'express';
import dotenv from 'dotenv';

import authController from './controllers/auth.controller';

dotenv.config();

const router = express.Router();

// Register a new user
router.post('/auth/register', authController.register);

// Login an existing user
router.post('/auth/login', authController.login);

export default router;
