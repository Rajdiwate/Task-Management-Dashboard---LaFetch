import { logger } from '@/utils/logger';

export const callHandler = (contactNumber?: string) => {
  const cleanedNumber = contactNumber?.trim();

  if (!cleanedNumber) {
    logger.warn('No contact number provided');
    return;
  }

  try {
    window.location.href = `tel:${cleanedNumber}`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to initiate call:', errorMessage);
  }
};
