import z from 'zod';

export const loginPageSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type loginPageSchemaType = z.infer<typeof loginPageSchema>;
