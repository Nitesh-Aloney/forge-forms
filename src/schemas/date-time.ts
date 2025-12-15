import { z } from 'zod';
import { evaluateDateTimeExpression } from '@/utils/date-time';

export const ISODateTimeStringSchema = z.string().datetime({
  message: 'Date-time format should be a valid ISO 8601 format (e.g., YYYY-MM-DDTHH:mm:ss.sssZ)',
});
export type TISODateTimeString = z.infer<typeof ISODateTimeStringSchema>;

/**
 * Represents a schema for the current date and time ("now").
 */
export const NowDateTimeSchema = z.literal('__now__').describe('Current date and time');
export type TNowDateTime = z.infer<typeof NowDateTimeSchema>;

/**
 * Represents a schema for a date-time offset, which can include seconds, minutes, hours, days, months, and years.
 * This schema is used to specify how much to adjust a date-time by adding or subtracting time.
 *
 * @example
 * ```typescript
 * // Offset by 5 hours and 30 minutes in future
 * const offsetExample = {
 *   hrs: 5,
 *   mins: 30
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Offset by 1 year and 2 days in the past
 * const offsetExample = {
 *   yrs: -1,
 *   dys: -2
 * };
 * ```
 */
export const DateTimeOffsetSchema = z
  .object({
    dys: z.number().optional().describe('Days'),
    hrs: z.number().optional().describe('Hours'),
    mins: z.number().optional().describe('Minutes'),
    mnts: z.number().optional().describe('Months'),
    secs: z.number().optional().describe('Seconds'),
    yrs: z.number().optional().describe('Years'),
  })
  .describe('Offset to be applied to the current date and time');
export type TDateTimeOffset = z.infer<typeof DateTimeOffsetSchema>;

/**
 * Represents a schema for a date-time relative to a current or referenced date-time with an optional offset.
 *
 * This schema validates an object with:
 * - `init`: Either a "now" date-time reference or an ISO date-time string
 * - `offset`: An optional date-time offset specification
 *
 * @example
 * ```typescript
 * // Using "now" as the initial date-time with an offset
 * const relativeDateTime = {
 *   init: "__now__",
 *   offset: { hrs: 2, mins: 30 }
 * };
 *
 * // Using an ISO string as the initial date-time
 * const absoluteDateTime = {
 *   init: "2023-04-15T14:30:00.000Z"
 * };
 * ```
 */
export const RelativeDateTimeSchema = z
  .object({
    init: z.union([NowDateTimeSchema, ISODateTimeStringSchema]),
    offset: DateTimeOffsetSchema.optional(),
  })
  .describe('A date-time relative to the current/referenced date-time with an optional offset');
export type TRelativeDateTime = z.infer<typeof RelativeDateTimeSchema>;

/**
 * Union schema that accepts either an ISO date-time string, a "now" literal, or a relative date-time object.
 * This allows for flexible date-time representations in forms or configurations.
 *
 * @example
 * ```typescript
 * // Using an ISO date-time string
 * const dateTimeValue1: TDateTimeValue = "2023-04-15T14:30:00.000Z";
 *
 * // Using the "now" literal
 * const dateTimeValue2: TDateTimeValue = "__now__";
 *
 * // Using a relative date-time object with offset
 * const dateTimeValue3: TDateTimeValue = {
 *   init: "__now__",
 *   offset: { hrs: 2, mins: 30 }
 * };
 * ```
 */
export const DateTimeValueSchema = z.union([ISODateTimeStringSchema, NowDateTimeSchema, RelativeDateTimeSchema]);
export type TDateTimeValue = z.infer<typeof DateTimeValueSchema>;

/**
 * Verifies that a minimum date-time value is before or equal to a maximum date-time value.
 * This function is useful for validating date-time ranges.
 *
 * @param min - The minimum date-time value to compare
 * @param max - The maximum date-time value to compare
 * @returns `true` if the min is before or equal to max, `false` otherwise or if either value is invalid
 */
export const verifyMinMaxDateTime = (min: TDateTimeValue, max: TDateTimeValue) => {
  const maxDate = evaluateDateTimeExpression(max);
  const minDate = evaluateDateTimeExpression(min);

  if (!maxDate || !minDate || !maxDate.isSameOrBefore(minDate)) return false;
  return true;
};
