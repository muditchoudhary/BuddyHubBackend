import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserJWT } from '../types/users';

dotenv.config();

export const issueJWT = (user: UserJWT) => {
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
