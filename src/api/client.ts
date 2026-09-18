import { create } from 'axios';

import { ENV } from '@config/env';
console.log('ENV.API_URL', ENV.API_URL);
const apiClient = create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
