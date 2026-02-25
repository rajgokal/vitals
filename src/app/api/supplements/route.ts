import { createGetHandler, createPostHandler } from '@/lib/api-helpers';
export const GET = createGetHandler('vitals:supplements');
export const POST = createPostHandler('vitals:supplements', { agentOnly: true });
