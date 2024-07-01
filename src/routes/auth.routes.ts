import express, { Router } from 'express';
import passport from 'passport';
const router: Router = express.Router();

import AuthController from '../controllers/auth.controller';

const { register, login, googleAuthCallback } = AuthController();

router.post('/register', register);
router.post('/login', login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleAuthCallback);

export default router;
