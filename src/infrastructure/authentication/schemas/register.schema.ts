import { object, string, TypeOf } from 'zod';

import { validatePasswordComplexity } from '@/infrastructure/services/data.service';

export const registerSchema = object({
  body: object({
    firstname: string(),
    lastname: string(),
    nickname: string(),
    password: string(),
    passwordConfirmation: string(),
    email: string(),
  })
    .strict()
    .refine((data) => validatePasswordComplexity(data.password, 3))
    .refine((data) => data.password === data.passwordConfirmation),
});

export type RegisterInput = TypeOf<typeof registerSchema>;
