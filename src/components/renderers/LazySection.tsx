import { Alert, Box, CircularProgress } from '@mui/material';
import { type FC, memo } from 'react';
import useGetLazySectionElement from '@/hooks/useGetLazySectionElement';
import { useHide } from '@/hooks/useHide';
import type { TLazySectionElement } from '@/schemas/form-entites/layout';
import type { BaseRendererProps, BaseSectionProps } from '@/types';
import StaticSection from './StaticSection';

export type TLazySectionProps = BaseRendererProps & {
  schema: TLazySectionElement;
  expanded?: boolean;
  onExpansionChange?: (id?: string) => void;
};

/**
 * Lazy Section Renderer Component
 *
 * Renders a lazy section layout element that fetches its content dynamically from a URL.
 * Once loaded, it renders the content using the regular Section component.
 */
const LazySection: FC<BaseSectionProps<TLazySectionElement>> = ({ schema, expanded, onExpansionChange, path }) => {
  const isHidden = useHide(schema.hide, path ?? '');
  const { section, isLoading, error } = useGetLazySectionElement(schema, path, !isHidden);

  if (isHidden) return null;

  if (isLoading)
    return (
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: 100, py: 4 }}>
        <CircularProgress size={40} />
      </Box>
    );

  if (error || !section) return <Alert severity="error">Failed to fetch section</Alert>;

  return <StaticSection expanded={expanded} onExpansionChange={onExpansionChange} path={path} schema={section} />;
};

export default memo(LazySection);
