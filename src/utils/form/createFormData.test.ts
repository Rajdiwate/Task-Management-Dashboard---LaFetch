import { createFormData } from './createFormData';

describe('createFormData', () => {
  // Mock File object for testing
  const createMockFile = (name: string, size: number, type: string): File => {
    const file = new File([], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  it('should handle empty object', () => {
    const formData = createFormData({});
    expect(formData.entries().next().done).toBe(true);
  });

  it('should handle string values', () => {
    const formData = createFormData({
      name: 'Test User',
      email: 'test@example.com',
    });

    expect(formData.get('name')).toBe('Test User');
    expect(formData.get('email')).toBe('test@example.com');
  });

  it('should handle number values', () => {
    const formData = createFormData({
      age: 30,
      price: 99.99,
    });

    expect(formData.get('age')).toBe('30');
    expect(formData.get('price')).toBe('99.99');
  });

  it('should handle boolean values', () => {
    const formData = createFormData({
      isActive: true,
      isVerified: false,
    });

    expect(formData.get('isActive')).toBe('true');
    expect(formData.get('isVerified')).toBe('false');
  });

  it('should handle File objects', () => {
    const mockFile = createMockFile('test.png', 1024, 'image/png');
    const formData = createFormData({
      avatar: mockFile,
    });

    const file = formData.get('avatar') as File;
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe('test.png');
    expect(file.size).toBe(1024);
    expect(file.type).toBe('image/png');
  });

  it('should handle string arrays', () => {
    const formData = createFormData({
      tags: ['react', 'typescript', 'testing'],
    });

    // FormData.getAll() returns all values for a given key
    expect(formData.getAll('tags[0]')).toEqual(['react']);
    expect(formData.getAll('tags[1]')).toEqual(['typescript']);
    expect(formData.getAll('tags[2]')).toEqual(['testing']);
  });

  it('should ignore null and undefined values', () => {
    const formData = createFormData({
      name: 'Test',
      age: null,
      email: undefined,
      active: true,
    });

    const entries = Array.from(formData.entries());
    expect(entries).toHaveLength(2);
    expect(entries).toContainEqual(['name', 'Test']);
    expect(entries).toContainEqual(['active', 'true']);
  });

  it('should handle complex object with all value types', () => {
    const mockFile = createMockFile('doc.pdf', 2048, 'application/pdf');
    const formData = createFormData({
      name: 'Test User',
      age: 30,
      isActive: true,
      resume: mockFile,
      skills: ['JavaScript', 'TypeScript', 'React'],
      bio: 'Full-stack developer',
      rating: 4.5,
      metadata: null,
      settings: undefined,
    });

    // Check all expected fields are present with correct values
    expect(formData.get('name')).toBe('Test User');
    expect(formData.get('age')).toBe('30');
    expect(formData.get('isActive')).toBe('true');
    expect(formData.get('bio')).toBe('Full-stack developer');
    expect(formData.get('rating')).toBe('4.5');

    // Check File
    const file = formData.get('resume') as File;
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe('doc.pdf');

    // Check array
    expect(formData.getAll('skills[0]')).toEqual(['JavaScript']);
    expect(formData.getAll('skills[1]')).toEqual(['TypeScript']);
    expect(formData.getAll('skills[2]')).toEqual(['React']);

    // Check null/undefined are excluded
    expect(formData.has('metadata')).toBe(false);
    expect(formData.has('settings')).toBe(false);
  });
});
