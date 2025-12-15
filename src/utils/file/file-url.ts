/** Recognize image URLs (S3 or base64 or blob urls) */
export const isImageUrl = (url: string): boolean => {
  if (!url) return false;

  const clean = url.split('?')[0].split('#')[0].toLowerCase();

  return (
    clean.startsWith('data:image/') || // base64
    clean.startsWith('blob:') || // blob preview
    /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(clean) // extensions
  );
};

/** Extract actual filename from S3 URL */
export const getFileNameFromUrl = (url: string): string => {
  try {
    const clean = url.split('?')[0];
    const name = clean.split('/').pop();
    return name || 'File';
  } catch {
    return 'File';
  }
};
