import { createGetHandler, createPostHandler } from '@/lib/api-helpers';
export const GET = createGetHandler('vitals:genetics');
export const POST = createPostHandler('vitals:genetics', { agentOnly: true });
