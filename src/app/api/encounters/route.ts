import { createProfileGetHandler, createProfilePostHandler } from '@/lib/api-helpers';
export const GET = createProfileGetHandler('encounters');
export const POST = createProfilePostHandler('encounters', { agentOnly: true });