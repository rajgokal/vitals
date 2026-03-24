import { createProfileGetHandler, createProfilePostHandler } from '@/lib/api-helpers';
export const GET = createProfileGetHandler('immunizations');
export const POST = createProfilePostHandler('immunizations', { agentOnly: true });
