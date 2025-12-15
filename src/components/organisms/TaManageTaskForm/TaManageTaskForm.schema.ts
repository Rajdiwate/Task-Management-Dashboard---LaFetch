import z from 'zod';

export const TaManageTaskFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(3, 'Description must be at least 3 characters long'),
  status: z.enum(['todo', 'in-progress', 'done']),
  user: z.string().min(3, 'User must be at least 3 characters long'),
});

export type TaManageTaskFormSchema = z.infer<typeof TaManageTaskFormSchema>;
