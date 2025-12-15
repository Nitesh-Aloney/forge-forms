import { z } from 'zod';

export const ErrorDetails = z.object({
  code: z.string(),
  description: z.string(),
  field: z.string().optional(),
});

export type TErrorDetails = z.infer<typeof ErrorDetails>;

export const ErrorResponse = z.object({
  code: z.string(),
  errors: z.array(z.lazy(() => ErrorDetails)).optional(),
  message: z.string(),
  xrequestId: z.string().optional(),
});

export type TErrorResponse = z.infer<typeof ErrorResponse>;
