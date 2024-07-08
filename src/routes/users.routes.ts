import express, { Router } from 'express';
const router: Router = express.Router();

import UserController from '../controllers/user.controller';
import passport from 'passport';

const { getUser } = UserController();

router.get('/full', passport.authenticate('jwt', { session: false }), getUser);

export default router;
