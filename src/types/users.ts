export type UserJWT = {
  id: string;
  displayName: string;
  email: string;
  password: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};
