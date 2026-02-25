import { createGetHandler, createPostHandler } from '@/lib/api-helpers';
export const GET = createGetHandler('vitals:medications');
export const POST = createPostHandler('vitals:medications', { agentOnly: true });
