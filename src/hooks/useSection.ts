import { createContext, use } from 'react';
import FormsForgeWebError from '@/schemas/errors/ForgeFormsWebError';

export type TSectionContext = { sectionId: string; sectionIndex: number; name: string };

export const SectionContext = createContext<TSectionContext | null>(null);

export function useSection() {
  const context = use(SectionContext);
  if (!context) throw new FormsForgeWebError({ message: 'useSection must be used within a SectionProvider' });

  return context;
}
