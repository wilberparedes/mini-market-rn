const API_URL = process.env.API_URL;

console.log('API_URL', API_URL);
if (!API_URL) {
  throw new Error('API_URL environment variable is not defined');
}

export const ENV = {
  API_URL,
} as const;
