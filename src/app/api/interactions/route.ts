import { createGetHandler, createPostHandler } from '@/lib/api-helpers';
export const GET = createGetHandler('vitals:interactions');
export const POST = createPostHandler('vitals:interactions', { agentOnly: true });
