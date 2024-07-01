export type UserJWT = {
  id: string;
  displayName: string;
  email: string;
  password: string | null;
  googleId: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};
