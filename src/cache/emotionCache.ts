import createCache from '@emotion/cache';

const insertionPoint = document.querySelector<HTMLElement>('meta[name="emotion-insertion-point"]');

if (!insertionPoint) {
  throw new Error('Emotion insertion point not found in the document.');
}

export const muiCache = createCache({
  key: 'mui',
  insertionPoint,
});
