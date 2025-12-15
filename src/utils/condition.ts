import { dayJS } from '@/integrations/dayjs';
import { isISODateFormat } from '@/utils/date';
import { ConditionRuleSchema, type TCondition, type TConditionRule } from '../schemas/form-entites/condition';
import type { TOperator } from '../schemas/form-entites/operator';
import type { TFormValue } from '../types';
import { extractFieldReferencesFromArray } from './index';

/**
 * Evaluates an operation based on the provided operator
 *
 * @param lhs - Left operand
 * @param rhs - Right operand
 * @param operator - Operator to apply
 * @returns Result of the operation
 */
export const evaluateOperation = (lhs: TFormValue, rhs: TFormValue, operator: TOperator): boolean => {
  switch (operator) {
    case 'EQ': {
      if (Array.isArray(lhs) && Array.isArray(rhs))
        return lhs.length === rhs.length && lhs.every((item, index) => item === rhs[index]);
      if (typeof lhs === 'object' && typeof rhs === 'object') return JSON.stringify(lhs) === JSON.stringify(rhs);
      return lhs === rhs;
    }

    case 'N_EQ':
      return !evaluateOperation(lhs, rhs, 'EQ');

    case 'EMP':
      return (
        lhs === undefined ||
        lhs === null ||
        lhs === '' ||
        (Array.isArray(lhs) && lhs.length === 0) ||
        (typeof lhs === 'object' && lhs !== null && Object.keys(lhs).length === 0)
      );

    case 'N_EMP':
      return !evaluateOperation(lhs, rhs, 'EMP');

    case 'IN': {
      // number | string | boolean and number[] | string[] | boolean[] combination
      if (Array.isArray(rhs)) return rhs.includes(lhs as never);
      // string and string combination
      if (typeof rhs === 'string' && typeof lhs === 'string') return rhs.includes(lhs);
      return false;
    }

    case 'N_IN':
      return !evaluateOperation(lhs, rhs, 'IN');

    case 'GT': {
      if (typeof lhs === 'number' && typeof rhs === 'number') return lhs > rhs;
      if (typeof lhs === 'string' && typeof rhs === 'string' && isISODateFormat(lhs) && isISODateFormat(rhs))
        return dayJS(lhs).isAfter(dayJS(rhs));
      return false;
    }

    case 'GTE': {
      if (typeof lhs === 'number' && typeof rhs === 'number') return lhs >= rhs;
      if (typeof lhs === 'string' && typeof rhs === 'string' && isISODateFormat(lhs) && isISODateFormat(rhs))
        return dayJS(lhs).isSameOrAfter(dayJS(rhs));
      return false;
    }

    case 'LT': {
      if (typeof lhs === 'number' && typeof rhs === 'number') return lhs < rhs;
      if (typeof lhs === 'string' && typeof rhs === 'string' && isISODateFormat(lhs) && isISODateFormat(rhs))
        return dayJS(lhs).isBefore(dayJS(rhs));
      return false;
    }

    case 'LTE': {
      if (typeof lhs === 'number' && typeof rhs === 'number') return lhs <= rhs;
      if (typeof lhs === 'string' && typeof rhs === 'string' && isISODateFormat(lhs) && isISODateFormat(rhs))
        return dayJS(lhs).isSameOrBefore(dayJS(rhs));
      return false;
    }

    case 'BTW': {
      // biome-ignore lint/suspicious/noExplicitAny: TODO resolve this
      const [start, end] = rhs as any;
      if (typeof lhs === 'number' && typeof start === 'number' && typeof end === 'number') return start <= lhs && lhs <= end;
      if (
        typeof lhs === 'string' &&
        typeof start === 'string' &&
        typeof end === 'string' &&
        isISODateFormat(lhs) &&
        isISODateFormat(start) &&
        isISODateFormat(end)
      )
        return dayJS(lhs).isBetween(dayJS(start), dayJS(end), null, '[]');
      return false;
    }

    case 'HAS': {
      if (typeof lhs === 'string' && typeof rhs === 'string') return rhs.includes(lhs);
      if (Array.isArray(lhs) && Array.isArray(rhs)) return lhs.every(item => rhs.includes(item as never));
      return false;
    }

    default:
      console.warn(`Unsupported operator: ${operator}`);
      return false;
  }
};

export function extractFieldReferencesFromCondition(conditionSchema: TCondition) {
  if (typeof conditionSchema !== 'object' || !ConditionRuleSchema.safeParse(conditionSchema).success) return [];
  const [lhs, rhs] = conditionSchema as TConditionRule;
  return [
    ...extractFieldReferencesFromArray(Array.isArray(lhs) ? lhs : [lhs]),
    ...extractFieldReferencesFromArray(Array.isArray(rhs) ? rhs : [rhs]),
  ];
}
