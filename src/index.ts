import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';

import { initializePassport } from './configs/passport';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport(passport);
app.use(passport.initialize());

app.get('/test', (req: Request, res: Response) => {
  res.send('Working fine');
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json({
    success: true,
    msg: 'You are successfully authenticated to this route!',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
