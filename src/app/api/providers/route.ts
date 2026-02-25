import { createGetHandler, createPostHandler } from '@/lib/api-helpers';
export const GET = createGetHandler('vitals:providers');
export const POST = createPostHandler('vitals:providers', { agentOnly: true });
