import { useCallback } from 'react';
import type { TCustomFunctionSignature } from '@/types';
import { usePlugins } from './useFormIntegrations';

export function useCustomFunctions() {
  const plugins = usePlugins();
  const pluginCustomFunctions = plugins.customFunctions;

  const get = useCallback(
    (functionId: string): TCustomFunctionSignature => {
      try {
        if (pluginCustomFunctions && functionId in pluginCustomFunctions) return pluginCustomFunctions[functionId];

        switch (functionId) {
          case 'test':
            return () => true;
          default:
            console.warn(`Custom function with ID "${functionId}" not found in plugins or native functions`);
            return () => undefined;
        }
      } catch (error) {
        console.error(`Error retrieving custom function "${functionId}":`, error);
        return () => undefined;
      }
    },
    [pluginCustomFunctions]
  );

  return { get };
}
