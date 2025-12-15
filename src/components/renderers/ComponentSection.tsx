import { type FC, memo, Suspense } from 'react';
import { useComponent } from '@/hooks/useFormIntegrations';
import type { TComponentSectionElement } from '@/schemas/form-entites/layout';
import type { BaseRendererProps, BaseSectionProps } from '@/types';

export type TComponentSectionProps = BaseRendererProps & {
  schema: TComponentSectionElement;
  expanded?: boolean;
  onExpansionChange?: (id?: string) => void;
};

/**
 * Component Section Renderer Component
 *
 * Renders a component section layout element, That renders the component with component id.
 * if not component with the given id is passed it will render null
 */
const ComponentSection: FC<BaseSectionProps<TComponentSectionElement>> = ({ schema }) => {
  // return 'Component Section';
  const Component = useComponent(schema.componentId);

  if (!Component) return null;

  return (
    <Suspense>
      <Component />
    </Suspense>
  );
};

export default memo(ComponentSection);
