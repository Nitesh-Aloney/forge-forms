import { Accordion, AccordionSummary, Alert, AlertTitle, Box, Stack, Tooltip, Typography } from '@mui/material';
import { type FC, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormIntegrations } from '@/hooks/useFormIntegrations';
import type { TErrorDetails } from '@/schemas/errors/error-response';
import type { TReview } from '@/schemas/form-entites/reviews';
import { colors } from '@/styles/colors';
import Declarations from '../Declarations';
import FieldErrors from './FieldErrors';
import FieldWithValue from './FieldWithValue';

type TReviewProps = {
  config?: TReview;
};

const Review: FC<TReviewProps> = ({ config }) => {
  const { fieldMappings, goto, submitErrors = [], successRenderer } = useFormIntegrations();
  const { getValues } = useFormContext();

  const fieldWiseErrorsMessages = useMemo(() => {
    const errorMap: Record<string, string[]> = {};
    for (const error of submitErrors) {
      const fieldKey = error.field ?? '';
      if (!errorMap[fieldKey]) errorMap[fieldKey] = [];
      errorMap[fieldKey].push(error.description);
    }
    return errorMap;
  }, [submitErrors]);

  const sectionWiseFieldInfo = useMemo(() => {
    const sectionMap: Record<
      string,
      { title: string; items: { value: string; name: string; errors: string[]; path: string }[] }
    > = {};

    for (const [key, { section, fieldName, sectionName }] of Object.entries(fieldMappings)) {
      if (!sectionMap[section]) sectionMap[section] = { items: [], title: sectionName };
      sectionMap[section].items.push({
        errors: fieldWiseErrorsMessages[key] || [],
        name: fieldName,
        path: key,
        value: getValues(key),
      });
    }
    return sectionMap;
  }, [fieldMappings, getValues, fieldWiseErrorsMessages]);

  const sectionWiseErrors = useMemo(() => {
    // section Id to errors
    const errorMap: Record<string, TErrorDetails[]> = {};
    for (const error of submitErrors) {
      const fieldKey = error.field ?? '';
      const mapping = fieldMappings[fieldKey];
      if (!mapping) continue;
      if (!errorMap[mapping.section]) errorMap[mapping.section] = [];
      errorMap[mapping.section].push(error);
    }
    return errorMap;
  }, [submitErrors, fieldMappings]);

  useEffect(() => {
    if (!successRenderer || typeof window === 'undefined') return;
    window.scrollTo({ behavior: 'smooth', top: 0 });
  }, [successRenderer]);

  return (
    <Stack sx={{ gap: 1, width: '100%' }}>
      {/* Success banner */}
      {successRenderer}
      {/* Field level Errors */}
      {submitErrors.length ? (
        <Alert id="form-validation-errors" severity="error">
          <AlertTitle>
            <Typography fontWeight={500} variant="body1">
              Please fix the errors below
            </Typography>
          </AlertTitle>
          <Typography component="div" variant="body2">
            <ul>
              {Object.entries(fieldWiseErrorsMessages).map(([key, messages]) => (
                <FieldErrors
                  fieldName={fieldMappings[key]?.fieldName ?? key}
                  key={key}
                  messages={messages}
                  onClick={
                    !fieldMappings[key]
                      ? undefined
                      : () => {
                          const { section, step } = fieldMappings[key];
                          window.location.hash = `#${section}`;
                          goto(step);
                        }
                  }
                />
              ))}
            </ul>
          </Typography>
        </Alert>
      ) : null}
      {/* Review Sections */}
      {Object.entries(sectionWiseFieldInfo).map(([sectionId, { title, items }]) => {
        const sectionErrors = sectionWiseErrors[sectionId] || [];
        const hasErrors = sectionErrors.length > 0;
        return (
          <Accordion
            expanded={true}
            id={sectionId}
            key={sectionId}
            slotProps={{ root: { variant: 'outlined' } }}
            sx={({ palette }) => ({
              '&.MuiPaper-root': { '&::before': { display: 'none' }, margin: 0 },
              border: `1px solid ${hasErrors ? palette.error.main : colors.gray[30]}`,
              borderRadius: 2,
              boxShadow: 'none',
              px: 2,
              py: 1,
            })}
          >
            <AccordionSummary aria-controls={`section-${title}-content`} sx={{ px: 0 }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5, justifyContent: 'space-between', width: '100%' }}>
                <Typography fontWeight={600} variant="h6">
                  {title || 'Review Information'}
                </Typography>
                <Tooltip title="Edit this section">
                  <Typography
                    onClick={() => {
                      const index = Object.keys(fieldMappings).find(key => fieldMappings[key].section === sectionId);
                      if (index === undefined) return;
                      window.location.hash = `#${sectionId}`;
                      goto(fieldMappings[index].step);
                    }}
                    sx={{ color: colors['ink-blue'][50], cursor: 'pointer', fontWeight: 600, px: 2 }}
                    variant="subtitle1"
                  >
                    Edit
                  </Typography>
                </Tooltip>
              </Box>
            </AccordionSummary>
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {items.map(({ name, value, path }) => (
                  <Box key={path} sx={{ flexGrow: 1, mb: 1.5, minWidth: '12rem', mr: 1, width: '40%' }}>
                    <FieldWithValue name={name} value={value} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Accordion>
        );
      })}
      {/* Declarations */}
      {config?.declarations && config.declarations?.length > 0 && (
        <Box sx={{ border: `1px solid ${colors.gray[30]}`, borderRadius: 2, p: 2 }}>
          <Declarations declarations={config.declarations} />
        </Box>
      )}
    </Stack>
  );
};

export default Review;
