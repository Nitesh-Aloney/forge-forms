import { z } from 'zod';

/**
 * Operator Schema
 *
 * Defines the valid operators for condition rules used throughout the form.
 * These operators are used to create conditions for field visibility, requirement, etc.
 *
 * Operators:
 * - EQ: Equal to
 * - N_EQ: Not equal to
 * - IN: Value is in a list
 * - N_IN: Value is not in a list
 * - GT: Greater than
 * - GTE: Greater than or equal to
 * - LT: Less than
 * - LTE: Less than or equal to
 * - EMP: Is empty
 * - N_EMP: Is not empty
 * - BTW: Between (inclusive)
 * - HAS: Contains (substring match)
 *
 * @example
 * // Using operators in conditions
 * const conditions = [
 *   // Age is greater than 18
 *   ["age", "18", "GT"],
 *
 *   // Status is not 'inactive'
 *   ["status", "inactive", "N_EQ"],
 *
 *   // Country is in the list of supported countries
 *   ["country", "US,CA,UK,AU", "IN"],
 *
 *   // Email is not empty
 *   ["email", "", "N_EMP"]
 * ];
 */
export const OperatorSchema = z.enum(['EQ', 'N_EQ', 'IN', 'N_IN', 'GT', 'GTE', 'LT', 'LTE', 'EMP', 'N_EMP', 'BTW', 'HAS']);
export type TOperator = z.infer<typeof OperatorSchema>;
