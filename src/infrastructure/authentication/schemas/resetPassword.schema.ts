import { object, string, TypeOf } from 'zod';

export const resetPasswordSchema = object({
  body: object({
    email: string().email(),
  }).strict(),
});

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
