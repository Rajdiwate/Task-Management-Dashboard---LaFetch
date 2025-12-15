import { logger } from '@/utils/logger';

export const directionHandler = (mapUrl?: string) => {
  const cleanedUrl = mapUrl?.trim();

  if (!cleanedUrl) {
    logger.warn('No map URL provided');
    return;
  }

  try {
    window.open(cleanedUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to open directions:', errorMessage);
  }
};
