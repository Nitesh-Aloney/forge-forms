import { type FC, memo, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormIntegrations } from '@/hooks/useFormIntegrations';
import { useHide } from '@/hooks/useHide';
import type { TSectionElement } from '@/schemas/form-entites/layout';
import type { BaseSectionProps } from '@/types';
import ComponentSection from './ComponentSection';
import LazySection from './LazySection';
import StaticSection from './StaticSection';

/**
 * Section Router Component
 *
 * A unified component for rendering different section types
 * based on the sectionType in the schema.
 */
const Section: FC<BaseSectionProps<TSectionElement>> = ({ schema, path, expanded, onExpansionChange }) => {
  const { setValue, unregister } = useFormContext();
  const { fieldMappings } = useFormIntegrations();
  const isHidden = useHide(schema.hide, path ?? '');

  useEffect(() => {
    if (!isHidden) return;
    const fieldsInCurrSection = Object.entries(fieldMappings)
      .filter(([, config]) => config.section === schema.id)
      .map(([fieldPath]) => fieldPath);
    for (const fieldPath of fieldsInCurrSection) {
      setValue(fieldPath, undefined);
      unregister(fieldPath);
    }
  }, [fieldMappings, isHidden, schema.id, unregister, setValue]);

  if (isHidden) return null;

  switch (schema.sectionType) {
    case 'lazy':
      return <LazySection expanded={expanded} onExpansionChange={onExpansionChange} path={path} schema={schema} />;
    case 'component':
      return <ComponentSection expanded={expanded} onExpansionChange={onExpansionChange} path={path} schema={schema} />;
    default:
      return <StaticSection expanded={expanded} onExpansionChange={onExpansionChange} path={path} schema={schema} />;
  }
};

export default memo(Section);
