import { createProfileGetHandler, createProfilePostHandler } from '@/lib/api-helpers';
export const GET = createProfileGetHandler('genetics');
export const POST = createProfilePostHandler('genetics', { agentOnly: true });
