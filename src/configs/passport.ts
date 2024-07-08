import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt, WithSecretOrKey } from 'passport-jwt';
// import { Strategy as GoogleStrategy, StrategyOptions } from 'passport-google-oauth20';
import { PassportStatic } from 'passport';
import dotenv from 'dotenv';

dotenv.config();

import prisma from './prisma';

const jwtOptions: WithSecretOrKey = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

/*
const googleStrategyOptions: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
};
*/

export const initializePassport = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
      console.log('we react here even though token has expired');
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
  //   I drop the idea of using google auth but streatgy will be here for future reference
  /*
  passport.use(
    new GoogleStrategy(googleStrategyOptions, async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId: profile.id }, { email: profile.emails[0].value }],
          },
        });
        if (!user) {
          const user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value,
              displayName: profile.displayName,
            },
          });
          return done(null, user);
        }
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error, false);
      }
    }),
  );
  */
};
