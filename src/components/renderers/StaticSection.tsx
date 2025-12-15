import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, type AccordionProps, AccordionSummary, Box, Typography } from '@mui/material';
import { type FC, memo, type SyntheticEvent, useCallback } from 'react';
import { useHide } from '@/hooks/useHide';
import type { TStaticSectionElement } from '@/schemas/form-entites/layout';
import { colors } from '@/styles/colors';
import type { BaseSectionProps } from '@/types';
import { Nudges } from './Nudge';
import ObjectList from './ObjectList';
import Row from './Row';

/**
 * Static Section Renderer Component
 *
 * Renders a static section layout element that groups related rows together.
 * Sections can be collapsable and contain multiple rows or object lists.
 */
const StaticSection: FC<BaseSectionProps<TStaticSectionElement>> = ({ schema, expanded, onExpansionChange, path }) => {
  const { title, subtitle, items, collapsable } = schema;
  const isHidden = useHide(schema.hide, path ?? '');

  const isNotCollapsable = typeof collapsable === 'undefined';

  const onChange: AccordionProps['onChange'] = useCallback(
    (_: SyntheticEvent, isExpanded: boolean) => {
      if (isNotCollapsable) return;
      onExpansionChange?.(isExpanded ? schema.id : undefined);
    },
    [isNotCollapsable, onExpansionChange, schema.id]
  );

  if (isHidden) return null;

  return (
    <Box
      sx={{
        mb: 2,
        py: 1,
        ...(!schema.borderless && {
          border: `1px solid ${colors.gray[30]}`,
          borderRadius: '4px',
          px: 2,
        }),
      }}
    >
      <Accordion
        expanded={isNotCollapsable ? true : expanded}
        onChange={onChange}
        sx={{
          '&.MuiPaper-root': { margin: 0 },
          boxShadow: 'none',
        }}
      >
        {title && (
          <AccordionSummary
            aria-controls={`section-${title}-content`}
            expandIcon={isNotCollapsable ? undefined : <ExpandMoreIcon />}
            sx={{ px: 0 }}
          >
            <Box>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
                <Typography variant="h6">{title}</Typography>
              </Box>
              {subtitle && (
                <Typography color="text.secondary" variant="subtitle1">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </AccordionSummary>
        )}
        <AccordionDetails sx={{ px: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            {schema.nudges?.length && <Nudges nudges={schema.nudges} />}

            {items?.map(item => {
              if (item.type === 'layout' && item.layoutType === 'row') {
                return <Row key={item.id} path={path} schema={item} />;
              }

              if (item.type === 'object-list') {
                return <ObjectList key={item.id} path={path} schema={item} />;
              }

              return null;
            })}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default memo(StaticSection);
