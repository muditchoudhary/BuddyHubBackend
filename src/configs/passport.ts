import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt, WithSecretOrKey } from 'passport-jwt';
import dotenv from 'dotenv';

import { PassportStatic } from 'passport';

dotenv.config();

import prisma from './prisma';

const jwtOptions: WithSecretOrKey = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const initializePassport = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: jwt_payload.sub,
          },
        });
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error, false);
      }
    }),
  );
};
