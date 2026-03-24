import { createProfileGetHandler, createProfilePostHandler } from '@/lib/api-helpers';
export const GET = createProfileGetHandler('interactions');
export const POST = createProfilePostHandler('interactions', { agentOnly: true });
