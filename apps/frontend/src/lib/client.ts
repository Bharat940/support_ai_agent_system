import { hc } from 'hono/client';
import type { AppType } from '../../../backend/src/index';

// Create a typed Hono client
// We use a relative path to backend for the type. 
// In a stricter monorepo setup, you might want to export this type from a shared package.
// Use environment variable for API URL, fallback to localhost in dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const client = hc<AppType>(API_URL);
