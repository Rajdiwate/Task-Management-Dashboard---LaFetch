import { shareBusinessEntityTemplate } from '@/assets/template/shareBusinessEntityTemplate';
import { shareConsumerTemplate } from '@/assets/template/shareConsumerTemplate';
import { logger } from '@/utils/logger';
import { ShareType } from '@/constants/shareType';

interface ShareHandlerProps {
  text: string;
  type: ShareType;
}

export const shareHandler = async ({ text, type }: ShareHandlerProps) => {
  let shareText;

  if (type === ShareType.CONSUMER_REFERRAL) {
    shareText = shareConsumerTemplate(text);
  } else if (type === ShareType.BUSINESS_ENTITY_DETAILS) {
    const businessEntityName = text.trim() || 'This Outlet';
    shareText = shareBusinessEntityTemplate(businessEntityName);
  } else {
    logger.error('Invalid share type');
    return;
  }

  if (!navigator.share) {
    logger.warn('Web Share API not supported on this browser');
    return;
  }

  try {
    await navigator.share({
      text: shareText,
    });

    logger.info('Content shared successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to share:', errorMessage);
  }
};
