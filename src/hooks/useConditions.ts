import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  ConditionFunctionSchema,
  ConditionRuleSchema,
  ConditionsOperator,
  type TCondition,
  type TConditionFunction,
  type TConditionRule,
  type TConditions,
} from '../schemas/form-entites/condition';
import type { TFormValue } from '../types';
import { evaluateOperation, extractFieldReferencesFromCondition } from '../utils/condition';
import { useCustomFunctions } from './useCustomFunctions';
import { useFieldResolvers } from './useFieldResolvers';

/**
 * Hook for evaluating dynamic form conditions
 *
 * @param path - The effective property path for the current form element
 * @returns An object with an evaluate function that checks if a condition is met
 * @example
 * const { evaluate } = useConditions();
 *
 * // Check a condition
 * const isConditionMet = evaluate(["{{person.age}}", "18", "GT"]);
 */
export const useConditions = (path: string) => {
  const { getValues } = useFormContext();
  const { get } = useCustomFunctions();
  const { resolveValues } = useFieldResolvers();

  const extractDependencies = useCallback((conditionsSchema: TCondition[] | TConditions) => {
    if (typeof conditionsSchema !== 'object') return [];
    const conditions = Array.isArray(conditionsSchema) ? conditionsSchema : conditionsSchema.conditions;
    return conditions.map(extractFieldReferencesFromCondition).flat(Number.POSITIVE_INFINITY) as string[];
  }, []);

  const evaluateFunctionCondition = useCallback(
    (funcCondition: TConditionFunction) => {
      return !!get(funcCondition.functionId)?.(getValues(path), getValues());
    },
    [get, getValues, path]
  );

  const evaluateRuleCondition = useCallback(
    (ruleCondition: TConditionRule) => {
      const [leftPath, rightPath, operator] = ruleCondition;

      const leftResolved = resolveValues(leftPath, path);
      const rightResolved = resolveValues(rightPath as TFormValue, path);

      return evaluateOperation(leftResolved, rightResolved, operator);
    },
    [resolveValues, path]
  );

  const evaluateSingle = useCallback(
    (condition: TCondition): boolean => {
      if (ConditionFunctionSchema.safeParse(condition).success) {
        return evaluateFunctionCondition(condition as TConditionFunction);
      }

      if (ConditionRuleSchema.safeParse(condition).success) {
        return evaluateRuleCondition(condition as TConditionRule);
      }

      return false;
    },
    [evaluateFunctionCondition, evaluateRuleCondition]
  );

  const evaluate = useCallback(
    (conditionsSchema: TCondition[] | TConditions): boolean => {
      const operator = Array.isArray(conditionsSchema) ? ConditionsOperator.enum.AND : conditionsSchema.type;
      const conditions = Array.isArray(conditionsSchema) ? conditionsSchema : conditionsSchema.conditions;

      if (conditions.length === 0) return true;

      switch (operator) {
        case ConditionsOperator.enum.OR:
          return conditions.some(evaluateSingle);
        default:
          return conditions.every(evaluateSingle);
      }
    },
    [evaluateSingle]
  );

  return { evaluate, evaluateSingle, extractDependencies };
};

export default useConditions;
