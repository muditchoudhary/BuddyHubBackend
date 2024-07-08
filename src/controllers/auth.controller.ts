import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { INTERNAL_SERVER_ERROR } from '../constants/globalStrings';
import prisma from '../configs/prisma';
import { issueJWT } from '../lib/utils';
import { UserJWT } from '../types/users';

dotenv.config();

const AuthController = () => {
  const register = async (req: Request, res: Response) => {
    try {
      const displayName = req.body.displayName;
      const email = req.body.email;
      const password = req.body.password;

      if (!displayName || !email || !password) {
        return res.status(400).json({
          message: 'Missing required fields',
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUser) {
        return res.status(409).json({
          message: 'User already exists with this email',
        });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT));

      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = await prisma.user.create({
        data: {
          displayName,
          email,
          password: hashedPassword,
          avatar: 'random avatar string',
        },
      });

      if (user) {
        const tokenObject = issueJWT(user);
        return res.status(200).json({
          message: 'Registration complete successfully',
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          user: {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };

  const login = async (req: Request, res: Response) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      if (!email || !password) {
        return res.status(400).json({
          message: 'Missing required fields',
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(401).json({
          message: 'Cannot find user with this email',
        });
      }

      const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: 'Incorrect password',
        });
      }

      const tokenObject = issueJWT(user);
      return res.status(200).json({
        message: 'Log in successfull',
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };

  const googleAuthCallback = (req: Request, res: Response) => {
    const profile: UserJWT = req.user as UserJWT;
    const tokenObject = issueJWT(profile);
    return res.status(200).json({
      message: 'Log in successfull',
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
    });
  };
  return { register, login, googleAuthCallback };
};

export default AuthController;
