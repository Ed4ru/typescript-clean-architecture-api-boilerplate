import { object, string, TypeOf } from 'zod';

export const loginSchema = object({
  body: object({
    email: string(),
    password: string(),
  }).strict(),
});

export type LoginInput = TypeOf<typeof loginSchema>;
