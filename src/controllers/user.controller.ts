import { Request, Response } from 'express';
import dotenv from 'dotenv';

import { INTERNAL_SERVER_ERROR } from '../constants/globalStrings';

import { User } from '@prisma/client';

dotenv.config();

const UserController = () => {
  const getUser = async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      if (user) {
        return res.status(200).json({
          user: {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        });
      } else {
        return res.status(404).json({
          message: 'User not found',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };

  return { getUser };
};

export default UserController;
