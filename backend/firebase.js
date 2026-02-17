import { onRequest } from 'firebase-functions/v2/https';
import app from './src/server.js';

export const api = onRequest({
    cors: true,
    maxInstances: 10,
    minInstances: 1,
    memory: '1GiB',
}, app);
