import { vi } from 'vitest';

// Mock City Icons
vi.mock('/src/assets/city/default.svg?react', () => ({
  default: () => <svg data-testid='default-city-icon' />,
}));

vi.mock('/src/assets/city/mumbai.svg?react', () => ({
  default: () => <svg data-testid='mumbai-city-icon' />,
}));

vi.mock('/src/assets/city/hyderabad.svg?react', () => ({
  default: () => <svg data-testid='hyderabad-city-icon' />,
}));

// Mock Category Icons
vi.mock('/src/assets/category/default.svg?react', () => ({
  default: () => <svg data-testid='default-category-icon' />,
}));

vi.mock('/src/assets/category/automobile.svg?react', () => ({
  default: () => <svg data-testid='automobile-category-icon' />,
}));

vi.mock('/src/assets/category/beauty.svg?react', () => ({
  default: () => <svg data-testid='beauty-category-icon' />,
}));

// Business Offer
vi.mock('/src/assets/business-offer/calender.svg?react', () => ({
  default: () => <svg data-testid='test-calendar-icon' />,
}));

// Offer Card
vi.mock('/src/assets/offer-card/normal-percentage.svg?react', () => ({
  default: () => <svg data-testid='normal-percentage-icon' />,
}));

vi.mock('/src/assets/offer-card/highlight-percentage.svg?react', () => ({
  default: () => <svg data-testid='highlight-percentage-icon' />,
}));

// Global SVGs
vi.mock('/src/assets/image/discount-tag/discount-tag-percent.svg?react', () => ({
  default: () => <svg data-testid='discount-tag-percent-icon' />,
}));

vi.mock('/src/assets/no-business-entities.svg?react', () => {
  return {
    default: () => <svg data-testid='no-business-entities-icon' />,
  };
});
