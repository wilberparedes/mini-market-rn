const storage = new Map<string, string | number | boolean>();

export const createMMKV = () => ({
  getString: (key: string): string | undefined => {
    const value = storage.get(key);
    return typeof value === 'string' ? value : undefined;
  },

  getNumber: (key: string): number | undefined => {
    const value = storage.get(key);
    return typeof value === 'number' ? value : undefined;
  },

  getBoolean: (key: string): boolean | undefined => {
    const value = storage.get(key);
    return typeof value === 'boolean' ? value : undefined;
  },

  set: (key: string, value: string | number | boolean): void => {
    storage.set(key, value);
  },

  delete: (key: string): void => {
    storage.delete(key);
  },

  contains: (key: string): boolean => {
    return storage.has(key);
  },

  clearAll: (): void => {
    storage.clear();
  },
});
