import { createContext, use } from 'react';
import FormsForgeWebError from '@/schemas/errors/ForgeFormsWebError';

export type TStepContext = { stepIndex: number; stepId: string };

export const StepContext = createContext<TStepContext | null>(null);

export function useStep() {
  const context = use(StepContext);
  if (!context) throw new FormsForgeWebError({ message: 'useStep must be used within a StepProvider' });

  return context;
}
