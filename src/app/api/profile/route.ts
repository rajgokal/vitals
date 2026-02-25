import { createGetHandler, createPostHandler } from '@/lib/api-helpers';
export const GET = createGetHandler('vitals:profile');
export const POST = createPostHandler('vitals:profile', { agentOnly: true });
