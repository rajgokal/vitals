import { createGetHandler, createPostHandler } from '@/lib/api-helpers';
export const GET = createGetHandler('vitals:immunizations');
export const POST = createPostHandler('vitals:immunizations', { agentOnly: true });
