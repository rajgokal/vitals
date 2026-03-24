import { createProfileGetHandler, createProfilePostHandler } from '@/lib/api-helpers';
export const GET = createProfileGetHandler('medications');
export const POST = createProfilePostHandler('medications', { agentOnly: true });
