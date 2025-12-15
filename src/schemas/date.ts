import { z } from 'zod';
import { DateTimeOffsetSchema } from './date-time';

export const ISODateStringSchema = z
  .string()
  .date('Date format should be YYYY-MM-DD')
  .describe('ISO 8601 date string (YYYY-MM-DD)');
export type TISODateString = z.infer<typeof ISODateStringSchema>;

/**
 * Represents a schema for the current date ("today").
 */
export const NowDateSchema = z.literal('__today__').describe('Current date (today)');
export type TNowDate = z.infer<typeof NowDateSchema>;

/**
 * Represents a schema for a date relative to a current or referenced date with an optional offset.
 *
 * This schema validates an object with:
 * - `init`: Either a "today" date reference or an ISO date string
 * - `offset`: An optional date offset specification
 *
 * @example
 * ```typescript
 * // Using "today" as the initial date with an offset
 * const relativeDate = {
 *   init: "__today__",
 *   offset: { dys: 7 }
 * };
 *
 * // Using an ISO string as the initial date
 * const absoluteDate = {
 *   init: "2023-04-15"
 * };
 * ```
 */
export const RelativeDateSchema = z
  .object({
    init: z.union([NowDateSchema, ISODateStringSchema]),
    offset: DateTimeOffsetSchema.optional(),
  })
  .describe('A date relative to the current/referenced date with an optional offset');
export type TRelativeDate = z.infer<typeof RelativeDateSchema>;

/**
 * Union schema that accepts either an ISO date string or a relative date object.
 * This allows for flexible date representations in forms or configurations.
 *
 * @example
 * // Using an ISO date string
 * const dateValue1: TDateValue = "2023-04-15";
 *
 * // Using a relative date object, e.g., 7 days from "2023-04-15"
 * const dateValue2: TDateValue = {
 *   init: "2023-04-15",
 *   offset: { dys: 7 }
 * };
 */
export const DateValueSchema = z.union([ISODateStringSchema, NowDateSchema, RelativeDateSchema]);
export type TDateValue = z.infer<typeof DateValueSchema>;
