import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '@prisma/client';

dotenv.config();

export const issueJWT = (user: User) => {
  const id = user.id;
  const expireIn = '1d';

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expireIn,
  });

  return {
    token: 'Bearer ' + signedToken,
    expires: expireIn,
  };
};
