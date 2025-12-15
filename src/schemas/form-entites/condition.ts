import { z } from 'zod';
import { OperatorSchema } from './operator';

/**
 * Schema for a condition rule which is a tuple of property path, value, and operator
 *
 * @example
 * // Basic condition checking if age is greater than 18
 * const ageCondition: TConditionRule = ["{{person.age}}", "18", "GT"];
 *
 * @example
 * // Condition checking if a field equals another field's value
 * const nameMatchCondition: TConditionRule = ["{{firstName}}", "{{lastName}}", "EQ"];
 *
 * @example
 * // Condition with empty property path (uses current property)
 * const selfReferenceCondition: TConditionRule = ["", "active", "EQ"];
 */
export const ConditionRuleSchema = z.tuple([
  z.union([z.string(), z.number(), z.boolean()]).describe('lhs: first parameter'),
  z
    .union([z.string(), z.number(), z.boolean(), z.string().array(), z.number().array(), z.boolean().array()])
    .describe('rhs: second parameter'),
  OperatorSchema,
]);
export type TConditionRule = z.infer<typeof ConditionRuleSchema>;

/**
 * Schema for a condition based on a function call
 *
 * @example
 * // Condition that calls a custom function
 * const functionCondition: TConditionFunction = {
 *   functionId: "isUserLoggedIn"
 * };
 *
 * @example
 * // Condition for complex validation logic
 * const complexCondition: TConditionFunction = {
 *   functionId: "validateAddress"
 * };
 */
export const ConditionFunctionSchema = z.object({
  functionId: z.string().nonempty(),
});
export type TConditionFunction = z.infer<typeof ConditionFunctionSchema>;

/**
 * Union type for conditions that can be either rule-based or function-based
 *
 * @example
 * // Rule-based condition
 * const condition1: TCondition = ["status", "active", "eq"];
 *
 * @example
 * // Function-based condition
 * const condition2: TCondition = {
 *   functionId: "checkAccountStatus"
 * };
 */
export const ConditionSchema = z.union([ConditionRuleSchema, ConditionFunctionSchema]);
export type TCondition = z.infer<typeof ConditionSchema>;

/**
 * Enum for the types of condition combinations
 */
export const ConditionsOperator = z.enum(['AND', 'OR']);
export type TConditionsOperatorType = z.infer<typeof ConditionsOperator>;

/**
 * Schema for a set of conditions combined with a logical operator
 * @example
 * // AND conditions
 * const andConditions: TConditions = {
 *   type: "AND",
 *   conditions: [
 *     ["{{age}}", 18, "GT"],
 *     ["{{country}}", "USA", "EQ"]
 *   ]
 * };
 *
 * @example
 * // OR conditions
 * const orConditions: TConditions = {
 *   type: "OR",
 *   conditions: [
 *     ["{{subscription}}", "premium", "EQ"],
 *     ["{{referralCode}}", "", "NEQ"]
 *   ]
 * };
 *
 */
export const ConditionsSchema = z.object({
  conditions: z.array(ConditionSchema),
  type: ConditionsOperator.default(ConditionsOperator.enum.AND),
});
export type TConditions = z.infer<typeof ConditionsSchema>;
