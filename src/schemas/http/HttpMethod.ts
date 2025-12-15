import { z } from 'zod';

export const HttpMethod = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

export type HttpMethod = z.infer<typeof HttpMethod>;
