import express, { Router } from 'express';
const router: Router = express.Router();

import AuthController from '../controllers/auth.controller';

const { register, login } = AuthController();

router.post('/register', register);
router.post('/login', login);

export default router;
