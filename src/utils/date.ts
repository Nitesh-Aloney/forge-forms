import type { Dayjs } from 'dayjs';
import { ISO_DATE_PATTERN } from '@/constants';
import { dayJS } from '@/integrations/dayjs';
import {
  DateValueSchema,
  ISODateStringSchema,
  NowDateSchema,
  RelativeDateSchema,
  type TDateValue,
  type TRelativeDate,
} from '@/schemas/date';

/**
 * Compares two ISO date strings and determines if the first date is later than the second date.
 *
 * @param supposedAfter - The first ISO date string to compare
 * @param supposedBefore - The second ISO date string to compare
 * @returns `true` if the first date is later than the second date, `false` otherwise
 *
 * @example
 * isISODateAfter("2023-10-01", "2023-09-30"); // returns true
 */
export const isISODateAfter = (supposedAfter: string, supposedBefore: string): boolean => {
  return new Date(supposedAfter).getTime() > new Date(supposedBefore).getTime();
};

/**
 * Converts a `Dayjs` object to an ISO date string (`YYYY-MM-DD` format).
 *
 * @param date - The `Dayjs` instance to convert
 * @returns The ISO date string representing the given date
 *
 * @example
 * dayJSToISODate(dayJS('2023-10-01')); // returns '2023-10-01'
 */
export const dayJSToISODate = (date: Dayjs): string => {
  return date.format(ISO_DATE_PATTERN);
};

/**
 * Converts an ISO date string to a `Dayjs` object if valid.
 *
 * @param isoDate - The ISO date string to convert
 * @returns A `Dayjs` object if the input is a valid ISO date string, otherwise `null`
 *
 * @example
 * isoDateToDayJS('2023-10-01'); // returns Dayjs object
 */
export const isoDateToDayJS = (isoDate: string): Dayjs | null => {
  return ISODateStringSchema.safeParse(isoDate).success ? dayJS(isoDate) : null;
};

/**
 * Checks whether a string is a valid ISO date in the `YYYY-MM-DD` format.
 *
 * @param value - The string to validate
 * @returns `true` if the string is a valid ISO date, `false` otherwise
 *
 * @example
 * isISODateFormat('2023-10-01'); // returns true
 * isISODateFormat('2023-13-01'); // returns false
 */
export const isISODateFormat = (value: string): boolean => {
  // Regex pattern for YYYY-MM-DD format with valid month (01-12) and day (01-31)
  const isoDateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  return isoDateRegex.test(value) && !Number.isNaN(new Date(value).getTime());
};

/**
 * Evaluates a relative date expression and returns the resulting Dayjs object.
 *
 * @param exp - The relative date expression to evaluate
 * @returns The resulting Dayjs object, or `null` if the base date is invalid
 *
 * @example
 * evaluateRelativeDate({ init: '2021-01-01', offset: { dys: 3 } }); // returns dayJS for date 3 days from the specified date
 */
export const evaluateRelativeDate = (exp: TRelativeDate) => {
  const { init, offset } = exp;
  const baseDate = init === NowDateSchema.value ? dayJS() : dayJS(init);
  if (!baseDate.isValid()) return null;

  let adjustedDate = baseDate;

  if (offset?.dys) adjustedDate = adjustedDate.add(offset.dys, 'day');
  if (offset?.mnts) adjustedDate = adjustedDate.add(offset.mnts, 'month');
  if (offset?.yrs) adjustedDate = adjustedDate.add(offset.yrs, 'year');

  return adjustedDate;
};

/**
 * Evaluates a date expression of type `TDateValue` and returns a Dayjs object.
 *
 * Supports:
 * - ISO date strings (`YYYY-MM-DD`)
 * - `"__today__"` (current date)
 * - Relative date expressions with optional offsets
 *
 * @param exp - The date expression to evaluate
 * @returns The resulting Dayjs object, or `null` if the input is invalid
 *
 * @example
 * evaluateDateExpression('2023-10-01'); // returns dayJS('2023-10-01')
 * evaluateDateExpression('__today__'); // returns dayJS for today's date
 * evaluateDateExpression({ init: '__today__', offset: { mnts: 1 } }); // returns dayJS for 1 month from today
 */
export const evaluateDateExpression = (exp: TDateValue) => {
  if (!DateValueSchema.safeParse(exp).success) return null;

  if (ISODateStringSchema.safeParse(exp).success) return dayJS(exp as string);
  if (NowDateSchema.safeParse(exp).success) return dayJS();
  if (RelativeDateSchema.safeParse(exp).success) return evaluateRelativeDate(exp as TRelativeDate);

  return null;
};

/**
 * Verifies that a minimum date is before or equal to a maximum date.
 * This function is useful for validating date ranges.
 *
 * @param min - The minimum date value to compare
 * @param max - The maximum date value to compare
 * @returns `true` if min is before or equal to max, `false` otherwise or if either value is invalid
 */
export const verifyMinMaxDate = (min: TDateValue, max: TDateValue) => {
  const maxDate = evaluateDateExpression(max);
  const minDate = evaluateDateExpression(min);

  if (!maxDate || !minDate || !maxDate.isSameOrAfter(minDate)) return false;
  return true;
};

/**
 * Formats a Dayjs date object into a string using the specified format.
 *
 * @param date - The Dayjs instance to format.
 * @param dateFormat - The format string to use (e.g., 'YYYY-MM-DD', 'DD/MM/YYYY').
 * @returns The formatted date string.
 *
 * @example
 * formatDayJSDate(dayJS('2023-10-01'), 'YYYY-MM-DD'); // returns '2023-10-01'
 * formatDayJSDate(dayJS('2023-10-01'), 'DD/MM/YYYY'); // returns '01/10/2023'
 */
export const formatDayJSDate = (date: Dayjs, dateFormat: string): string => {
  return date.format(dateFormat);
};
