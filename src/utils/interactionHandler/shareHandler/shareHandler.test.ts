import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shareHandler } from './sharehandler';
import { logger } from '@/utils/logger';
import { ShareType } from '@/constants/shareType';

// Mock the logger
vi.mock('@/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock share templates
vi.mock('@/assets/template/shareConsumerTemplate', () => ({
  shareConsumerTemplate: vi.fn((text) => `Consumer template with ${text}`),
}));

vi.mock('@/assets/template/shareBusinessEntityTemplate', () => ({
  shareBusinessEntityTemplate: vi.fn((name) => `Business template with ${name}`),
}));

describe('shareHandler', () => {
  let navigatorShareSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigator.share
    navigatorShareSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: navigatorShareSpy,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shares using consumer template when type is CONSUMER_REFERRAL', async () => {
    const { shareConsumerTemplate } = await import('@/assets/template/shareConsumerTemplate');
    const text = 'UserCode123';

    await shareHandler({ text, type: ShareType.CONSUMER_REFERRAL });

    expect(shareConsumerTemplate).toHaveBeenCalledWith(text);
    expect(navigatorShareSpy).toHaveBeenCalledWith({ text: `Consumer template with ${text}` });
    expect(logger.info).toHaveBeenCalledWith('Content shared successfully');
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('shares using business entity template with provided trimmed name', async () => {
    const { shareBusinessEntityTemplate } = await import(
      '@/assets/template/shareBusinessEntityTemplate'
    );
    const outletName = '  Outlet Name  ';
    const trimmedName = outletName.trim();

    await shareHandler({ text: outletName, type: ShareType.BUSINESS_ENTITY_DETAILS });

    expect(shareBusinessEntityTemplate).toHaveBeenCalledWith(trimmedName);
    expect(navigatorShareSpy).toHaveBeenCalledWith({
      text: `Business template with ${trimmedName}`,
    });
    expect(logger.info).toHaveBeenCalledWith('Content shared successfully');
  });

  it('uses default name "This Outlet" for business entity if text is empty or only whitespace', async () => {
    const { shareBusinessEntityTemplate } = await import(
      '@/assets/template/shareBusinessEntityTemplate'
    );

    await shareHandler({ text: '', type: ShareType.BUSINESS_ENTITY_DETAILS });
    expect(shareBusinessEntityTemplate).toHaveBeenCalledWith('This Outlet');
    expect(logger.info).toHaveBeenCalledWith('Content shared successfully');

    await shareHandler({ text: '   ', type: ShareType.BUSINESS_ENTITY_DETAILS });
    expect(shareBusinessEntityTemplate).toHaveBeenCalledWith('This Outlet');
  });

  it('logs error and does not call share when type is invalid', async () => {
    await shareHandler({ text: 'test', type: 'xyz' as ShareType });

    expect(logger.error).toHaveBeenCalledWith('Invalid share type');
    expect(navigatorShareSpy).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('logs warning and does not call share if navigator.share unsupported', async () => {
    // Remove navigator.share
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    await shareHandler({ text: 'test', type: ShareType.CONSUMER_REFERRAL });

    expect(logger.warn).toHaveBeenCalledWith('Web Share API not supported on this browser');
    expect(navigatorShareSpy).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('logs error when share fails with Error', async () => {
    const error = new Error('Share failed');
    navigatorShareSpy.mockRejectedValueOnce(error);

    await shareHandler({ text: 'test', type: ShareType.CONSUMER_REFERRAL });

    expect(logger.error).toHaveBeenCalledWith('Failed to share:', 'Share failed');
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('logs error when share fails with non-Error rejection', async () => {
    const fakeError = 'some string error';
    navigatorShareSpy.mockRejectedValueOnce(fakeError);

    await shareHandler({ text: 'test', type: ShareType.CONSUMER_REFERRAL });

    expect(logger.error).toHaveBeenCalledWith('Failed to share:', 'Unknown error');
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('handles multiple consecutive share calls', async () => {
    await shareHandler({ text: 'Store 1', type: ShareType.CONSUMER_REFERRAL });
    await shareHandler({ text: 'Store 2', type: ShareType.BUSINESS_ENTITY_DETAILS });
    await shareHandler({ text: 'Store 3', type: ShareType.CONSUMER_REFERRAL });

    expect(navigatorShareSpy).toHaveBeenCalledTimes(3);
    expect(logger.info).toHaveBeenCalledTimes(3);
  });

  it('is awaitable and returns a Promise', () => {
    const promise = shareHandler({ text: 'Test Store', type: ShareType.CONSUMER_REFERRAL });
    expect(promise).toBeInstanceOf(Promise);
    return promise;
  });

  it('trims whitespace before passing business entity name to template', async () => {
    const { shareBusinessEntityTemplate } = await import(
      '@/assets/template/shareBusinessEntityTemplate'
    );
    await shareHandler({ text: '   Whitespace Outlet  ', type: ShareType.BUSINESS_ENTITY_DETAILS });
    expect(shareBusinessEntityTemplate).toHaveBeenCalledWith('Whitespace Outlet');
  });

  it('handles special characters in text inputs', async () => {
    const specialText = 'Store & Co. "Premium"';
    const shareConsumerTemplateMock = vi.mocked(
      (await import('@/assets/template/shareConsumerTemplate')).shareConsumerTemplate,
    );
    shareConsumerTemplateMock.mockReturnValueOnce(`Consumer template with ${specialText}`);

    await shareHandler({ text: specialText, type: ShareType.CONSUMER_REFERRAL });

    expect(navigatorShareSpy).toHaveBeenCalledWith({
      text: expect.stringContaining(specialText),
    });
  });
});
