import { describe, it, expect } from 'vitest';
import { isImageUrl, getFileNameFromUrl } from './file-url';

describe('file utility functions', () => {
  describe('isImageUrl', () => {
    describe('valid image URLs', () => {
      it('recognizes base64 image URLs', () => {
        expect(isImageUrl('data:image/png;base64,iVBORw0KGgoAAAANS')).toBe(true);
        expect(isImageUrl('data:image/jpeg;base64,/9j/4AAQSkZJRg')).toBe(true);
        expect(isImageUrl('data:image/gif;base64,R0lGODlhAQABAIAA')).toBe(true);
        expect(isImageUrl('data:image/webp;base64,UklGRiQAAABXRUJQ')).toBe(true);
      });

      it('recognizes blob URLs', () => {
        expect(isImageUrl('blob:http://localhost:3000/abc-123')).toBe(true);
        expect(isImageUrl('blob:https://example.com/xyz-456')).toBe(true);
        expect(isImageUrl('blob:null/test-789')).toBe(true);
      });

      it('recognizes URLs with common image extensions', () => {
        expect(isImageUrl('https://example.com/image.png')).toBe(true);
        expect(isImageUrl('https://example.com/photo.jpg')).toBe(true);
        expect(isImageUrl('https://example.com/picture.jpeg')).toBe(true);
        expect(isImageUrl('https://example.com/graphic.gif')).toBe(true);
        expect(isImageUrl('https://example.com/image.webp')).toBe(true);
        expect(isImageUrl('https://example.com/bitmap.bmp')).toBe(true);
        expect(isImageUrl('https://example.com/vector.svg')).toBe(true);
      });

      it('recognizes image URLs with uppercase extensions', () => {
        expect(isImageUrl('https://example.com/IMAGE.PNG')).toBe(true);
        expect(isImageUrl('https://example.com/PHOTO.JPG')).toBe(true);
        expect(isImageUrl('https://example.com/Picture.JPEG')).toBe(true);
      });

      it('recognizes image URLs with query parameters', () => {
        expect(isImageUrl('https://example.com/image.png?size=large&quality=high')).toBe(true);
        expect(isImageUrl('https://example.com/photo.jpg?width=500')).toBe(true);
      });

      it('recognizes image URLs with hash fragments', () => {
        expect(isImageUrl('https://example.com/image.png#section1')).toBe(true);
        expect(isImageUrl('https://example.com/photo.jpg#anchor')).toBe(true);
      });

      it('recognizes image URLs with both query params and hash', () => {
        expect(isImageUrl('https://example.com/image.png?size=large#top')).toBe(true);
        expect(isImageUrl('https://s3.amazonaws.com/bucket/photo.jpg?token=abc#anchor')).toBe(true);
      });

      it('recognizes S3 URLs with image extensions', () => {
        expect(isImageUrl('https://s3.amazonaws.com/bucket/image.png')).toBe(true);
        expect(isImageUrl('https://bucket.s3.amazonaws.com/folder/photo.jpg')).toBe(true);
      });

      it('recognizes local file paths with image extensions', () => {
        expect(isImageUrl('/assets/images/logo.png')).toBe(true);
        expect(isImageUrl('./images/photo.jpg')).toBe(true);
        expect(isImageUrl('../graphics/icon.svg')).toBe(true);
      });
    });

    describe('invalid image URLs', () => {
      it('returns false for empty or null strings', () => {
        expect(isImageUrl('')).toBe(false);
        expect(isImageUrl(null as unknown as string)).toBe(false);
        expect(isImageUrl(undefined as unknown as string)).toBe(false);
      });

      it('returns false for non-image file extensions', () => {
        expect(isImageUrl('https://example.com/document.pdf')).toBe(false);
        expect(isImageUrl('https://example.com/video.mp4')).toBe(false);
        expect(isImageUrl('https://example.com/audio.mp3')).toBe(false);
        expect(isImageUrl('https://example.com/archive.zip')).toBe(false);
        expect(isImageUrl('https://example.com/data.json')).toBe(false);
        expect(isImageUrl('https://example.com/script.js')).toBe(false);
        expect(isImageUrl('https://example.com/style.css')).toBe(false);
      });

      it('returns false for non-image data URLs', () => {
        expect(isImageUrl('data:text/plain;base64,SGVsbG8gV29ybGQ=')).toBe(false);
        expect(isImageUrl('data:application/pdf;base64,JVBERi0xLjM=')).toBe(false);
      });

      it('returns false for URLs without extensions', () => {
        expect(isImageUrl('https://example.com/file')).toBe(false);
        expect(isImageUrl('https://example.com/image')).toBe(false);
        expect(isImageUrl('https://example.com/path/to/resource')).toBe(false);
      });

      it('returns false for URLs with image-like names but wrong extensions', () => {
        expect(isImageUrl('https://example.com/photo.txt')).toBe(false);
        expect(isImageUrl('https://example.com/image.html')).toBe(false);
      });

      it('returns false for plain text strings', () => {
        expect(isImageUrl('not a url')).toBe(false);
        expect(isImageUrl('image.png but not a url')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('handles URLs with multiple dots in filename', () => {
        expect(isImageUrl('https://example.com/my.image.file.png')).toBe(true);
        expect(isImageUrl('https://example.com/archive.tar.gz')).toBe(false);
      });

      it('handles URLs with encoded characters', () => {
        expect(isImageUrl('https://example.com/image%20file.png')).toBe(true);
        expect(isImageUrl('https://example.com/photo%2Btest.jpg')).toBe(true);
      });

      it('handles case sensitivity correctly', () => {
        expect(isImageUrl('https://example.com/Image.PNG')).toBe(true);
        expect(isImageUrl('DATA:IMAGE/PNG;base64,test')).toBe(true);
        expect(isImageUrl('BLOB:http://test.com/abc')).toBe(true);
      });

      it('handles URLs with no protocol', () => {
        expect(isImageUrl('//example.com/image.png')).toBe(true);
        expect(isImageUrl('example.com/photo.jpg')).toBe(true);
      });
    });
  });

  describe('getFileNameFromUrl', () => {
    describe('valid file URLs', () => {
      it('extracts filename from simple URLs', () => {
        expect(getFileNameFromUrl('https://example.com/image.png')).toBe('image.png');
        expect(getFileNameFromUrl('https://example.com/photo.jpg')).toBe('photo.jpg');
        expect(getFileNameFromUrl('https://example.com/document.pdf')).toBe('document.pdf');
      });

      it('extracts filename from URLs with paths', () => {
        expect(getFileNameFromUrl('https://example.com/folder/image.png')).toBe('image.png');
        expect(getFileNameFromUrl('https://example.com/path/to/file/photo.jpg')).toBe('photo.jpg');
        expect(getFileNameFromUrl('/assets/images/logo.png')).toBe('logo.png');
      });

      it('extracts filename from URLs with query parameters', () => {
        expect(getFileNameFromUrl('https://example.com/image.png?size=large')).toBe('image.png');
        expect(getFileNameFromUrl('https://example.com/photo.jpg?width=500&height=300')).toBe(
          'photo.jpg',
        );
        expect(getFileNameFromUrl('https://s3.amazonaws.com/bucket/file.pdf?token=abc123')).toBe(
          'file.pdf',
        );
      });

      it('extracts filename from S3 URLs', () => {
        expect(getFileNameFromUrl('https://s3.amazonaws.com/bucket/image.png')).toBe('image.png');
        expect(getFileNameFromUrl('https://bucket.s3.amazonaws.com/folder/photo.jpg')).toBe(
          'photo.jpg',
        );
        expect(
          getFileNameFromUrl('https://s3-us-west-2.amazonaws.com/my-bucket/uploads/file.pdf'),
        ).toBe('file.pdf');
      });

      it('extracts filename with multiple dots', () => {
        expect(getFileNameFromUrl('https://example.com/my.image.file.png')).toBe(
          'my.image.file.png',
        );
        expect(getFileNameFromUrl('https://example.com/archive.tar.gz')).toBe('archive.tar.gz');
      });

      it('extracts filename with special characters', () => {
        expect(getFileNameFromUrl('https://example.com/my_file-name.png')).toBe('my_file-name.png');
        expect(getFileNameFromUrl('https://example.com/file (1).jpg')).toBe('file (1).jpg');
      });

      it('extracts filename with encoded characters', () => {
        expect(getFileNameFromUrl('https://example.com/my%20file.png')).toBe('my%20file.png');
        expect(getFileNameFromUrl('https://example.com/photo%2Btest.jpg')).toBe('photo%2Btest.jpg');
      });
    });

    describe('edge cases and fallbacks', () => {
      it('returns "File" for URLs ending with slash', () => {
        expect(getFileNameFromUrl('https://example.com/')).toBe('File');
        expect(getFileNameFromUrl('https://example.com/folder/')).toBe('File');
      });

      it('returns "File" for URLs without filename', () => {
        expect(getFileNameFromUrl('https://example.com')).toBe('example.com');
        expect(getFileNameFromUrl('https://example.com?query=test')).toBe('example.com');
      });

      it('handles blob URLs', () => {
        expect(getFileNameFromUrl('blob:http://localhost:3000/abc-123-def')).toBe('abc-123-def');
        expect(getFileNameFromUrl('blob:null/test-789')).toBe('test-789');
      });

      it('handles errors gracefully', () => {
        expect(getFileNameFromUrl(null as unknown as string)).toBe('File');
        expect(getFileNameFromUrl(undefined as unknown as string)).toBe('File');
      });

      it('handles local file paths', () => {
        expect(getFileNameFromUrl('/assets/images/logo.png')).toBe('logo.png');
        expect(getFileNameFromUrl('./images/photo.jpg')).toBe('photo.jpg');
        expect(getFileNameFromUrl('../uploads/document.pdf')).toBe('document.pdf');
      });
    });

    describe('complex URL scenarios', () => {
      it('handles URLs with both query params and hash', () => {
        expect(getFileNameFromUrl('https://example.com/image.png?size=large#top')).toBe(
          'image.png',
        );
        expect(getFileNameFromUrl('https://example.com/file.pdf?v=2#page=10')).toBe('file.pdf');
      });

      it('handles CloudFront or CDN URLs', () => {
        expect(getFileNameFromUrl('https://d111111abcdef8.cloudfront.net/images/photo.jpg')).toBe(
          'photo.jpg',
        );
        expect(getFileNameFromUrl('https://cdn.example.com/assets/logo.png')).toBe('logo.png');
      });

      it('handles very long filenames', () => {
        const longFilename = 'a'.repeat(200) + '.png';
        expect(getFileNameFromUrl(`https://example.com/${longFilename}`)).toBe(longFilename);
      });

      it('handles URLs with port numbers', () => {
        expect(getFileNameFromUrl('http://localhost:3000/uploads/image.png')).toBe('image.png');
        expect(getFileNameFromUrl('https://example.com:8080/files/document.pdf')).toBe(
          'document.pdf',
        );
      });
    });
  });
});
