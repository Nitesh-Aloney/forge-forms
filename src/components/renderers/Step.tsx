import { Box, Stack, Typography } from '@mui/material';
import { type FC, memo, useState } from 'react';
import { useRenderer } from '@/hooks/useFormIntegrations';
import { useHide } from '@/hooks/useHide';
import { SectionContext } from '@/hooks/useSection';
import type { TStepElement } from '@/schemas/form-entites/layout';
import type { BaseRendererProps, TStepperTitleRendererProps } from '@/types';
import { Nudges } from './Nudge';
import Section from './Section';

export type TStepProps = BaseRendererProps & {
  schema: TStepElement;
};

/**
 * Step Renderer Component
 *
 * Renders a step layout element that represents a page in a multi-step form.
 * Each step contains one or more sections.
 */
const Step: FC<TStepProps> = ({ schema, path }) => {
  const { title, subtitle, sections } = schema;
  const [expandedSection, setExpandedSection] = useState<string | undefined>(sections[0].id);
  const isHidden = useHide(schema.hide, path ?? '');
  const StepTitleRenderer = useRenderer('stepTitle') as FC<TStepperTitleRendererProps>;

  if (isHidden) return null;

  if (sections.length === 0) {
    return (
      <Box sx={{ border: '1px dashed gray', borderRadius: 1, mt: 2, p: 2 }}>
        <Typography color="text.secondary" variant="body2">
          No sections found
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      {StepTitleRenderer ? (
        <StepTitleRenderer stepSchema={schema} />
      ) : (
        <Box>
          <Typography fontWeight={500} variant="h5">
            {title}
          </Typography>
          {subtitle && <Typography variant="body2">{subtitle}</Typography>}
        </Box>
      )}

      {schema.nudges?.length && <Nudges nudges={schema.nudges} />}

      <Box>
        {sections.map((section, ind) => (
          <Box id={section.id} key={section.id}>
            <SectionContext value={{ name: section.title ?? '', sectionId: section.id, sectionIndex: ind }}>
              <Section
                expanded={expandedSection === section.id}
                onExpansionChange={setExpandedSection}
                path={path}
                schema={section}
              />
            </SectionContext>
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default memo(Step);
