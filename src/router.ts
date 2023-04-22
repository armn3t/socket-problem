import express from 'express';
import dotenv from 'dotenv';

import authController from './controllers/auth.controller';
import channelController from './controllers/channel.controller';

import { isAuthenticated } from './middleware/authenticated';

dotenv.config();

const router = express.Router();

router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)

router.get('/channel', isAuthenticated, channelController.fetch)
router.post('/channel', isAuthenticated, channelController.create)

export default router;
