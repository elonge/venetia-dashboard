import { resolve } from 'path';
import { config } from 'dotenv';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });
