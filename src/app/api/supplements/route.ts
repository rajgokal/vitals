import { createProfileGetHandler, createProfilePostHandler } from '@/lib/api-helpers';
export const GET = createProfileGetHandler('supplements');
export const POST = createProfilePostHandler('supplements', { agentOnly: true });
