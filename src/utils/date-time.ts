import type { Dayjs } from 'dayjs';
import { dayJS } from '@/integrations/dayjs';
import type { TDateValue } from '@/schemas/date';
import {
  DateTimeValueSchema,
  ISODateTimeStringSchema,
  NowDateTimeSchema,
  RelativeDateTimeSchema,
  type TRelativeDateTime,
} from '@/schemas/date-time';

/**
 * Evaluates a relative date-time expression and returns the resulting datetime.
 *
 * @param exp - The relative date-time expression to evaluate
 * @returns The resulting Dayjs date-time object, or `null` if the base date is invalid
 *
 * @example
 * evaluateRelativeDateTime({ init: '2021-01-01T12:30:00Z', offset: { dys: 3, hrs: 2 } });
 * // returns dayJS for datetime 3 days and 2 hours from the specified time
 */
export const evaluateRelativeDateTime = (exp: TRelativeDateTime) => {
  const { init, offset } = exp;
  const baseDate = init === NowDateTimeSchema.value ? dayJS() : dayJS(init);
  if (!baseDate.isValid()) return null;

  let adjustedDate = baseDate;

  if (offset?.dys) adjustedDate = adjustedDate.add(offset.dys, 'days');
  if (offset?.mnts) adjustedDate = adjustedDate.add(offset.mnts, 'months');
  if (offset?.yrs) adjustedDate = adjustedDate.add(offset.yrs, 'years');
  if (offset?.hrs) adjustedDate = adjustedDate.add(offset.hrs, 'hours');
  if (offset?.mins) adjustedDate = adjustedDate.add(offset.mins, 'minutes');
  if (offset?.secs) adjustedDate = adjustedDate.add(offset.secs, 'seconds');

  return adjustedDate;
};

/**
 * Evaluates a date-time expression and returns the resulting Dayjs object.
 *
 * Supports:
 * - ISO date-time strings (e.g., `YYYY-MM-DDTHH:mm:ss.sssZ`)
 * - `"__now__"` (current date-time)
 * - Relative date-time expressions with optional offsets
 *
 * @param exp - The date-time expression to evaluate
 * @returns The resulting Dayjs object, or `null` if the input is invalid
 *
 * @example
 * evaluateDateTimeExpression('2023-10-01T14:30:00Z'); // returns dayJS for that exact time
 * evaluateDateTimeExpression('__now__'); // returns dayJS for current date-time
 * evaluateDateTimeExpression({ init: '__now__', offset: { hrs: 2 } }); // returns dayJS for 2 hours from now
 */
export const evaluateDateTimeExpression = (exp: TDateValue) => {
  if (!DateTimeValueSchema.safeParse(exp).success) return null;

  if (ISODateTimeStringSchema.safeParse(exp).success) return dayJS(exp as string);
  if (NowDateTimeSchema.safeParse(exp).success) return dayJS();
  if (RelativeDateTimeSchema.safeParse(exp).success) return evaluateRelativeDateTime(exp as TRelativeDateTime);

  return null;
};

/**
 * Verifies that a minimum date-time is before or equal to a maximum date-time.
 *
 * @param min - The minimum date-time value
 * @param max - The maximum date-time value
 * @returns `true` if min is before or equal to max, `false` otherwise or if either value is invalid
 *
 * @example
 * verifyMinMaxDateTime('2023-01-01T00:00:00Z', '2023-01-02T00:00:00Z'); // returns true
 * verifyMinMaxDateTime('2023-01-02T00:00:00Z', '2023-01-01T00:00:00Z'); // returns false
 */
export const verifyMinMaxDateTime = (min: TDateValue, max: TDateValue) => {
  const maxDate = evaluateDateTimeExpression(max);
  const minDate = evaluateDateTimeExpression(min);

  if (!maxDate || !minDate || !maxDate.isSameOrAfter(minDate)) return false;
  return true;
};

export const withInDateTime = (val: Dayjs, minIfAny: Dayjs | UndefinedOrNull, maxIfAny: Dayjs | UndefinedOrNull) => {
  if (minIfAny && val.isBefore(minIfAny)) return false;
  if (maxIfAny && val.isAfter(maxIfAny)) return false;
  return true;
};
