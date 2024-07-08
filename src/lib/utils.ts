import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserJWT } from '../types/users';

dotenv.config();

export const issueJWT = (user: UserJWT) => {
  const id = user.id;
  const expireIn = '24h';

  const payload = {
    sub: id,
    iat: Math.floor(Date.now() / 1000),
  };

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expireIn,
  });

  return {
    token: 'Bearer ' + signedToken,
    expires: expireIn,
  };
};
