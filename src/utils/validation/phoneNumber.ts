import { z } from 'zod';

export const phoneNumberValidation = z
  .string()
  .min(1, { message: 'Phone number is required.' })
  .regex(/^([6-9]\d{9})$/, {
    message: 'Please enter a valid phone number.',
  });
