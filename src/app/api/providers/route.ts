import { createProfileGetHandler, createProfilePostHandler } from '@/lib/api-helpers';
export const GET = createProfileGetHandler('providers');
export const POST = createProfilePostHandler('providers', { agentOnly: true });
