import { Box, Button, Step as StepFromMUI, StepLabel, Stepper, Typography } from '@mui/material';
import { type FC, memo, useCallback } from 'react';
import { type FieldValues, FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import Back from '@/components/actions/Back';
import Next from '@/components/actions/Next';
import Save from '@/components/actions/Save';
import { useFormIntegrations, useRenderer } from '@/hooks/useFormIntegrations';
import { StepContext } from '@/hooks/useStep';
import type { TFormElement } from '@/schemas/form-entites/form';
import { CONTEXT_REFERENCE } from '@/schemas/form-entites/special-keywords';
import type { BaseRendererProps, TStepperRendererProps } from '@/types';
import Review from './review';
import Step from './Step';
import WithFormTag from './WithFormTag';

interface TFormProps extends BaseRendererProps {
  schema: TFormElement;
}

/**
 * Form Renderer Component
 *
 * Renders a dynamic form with steps, sections, and fields.
 * Supports both single-step and multi-step forms.
 * Includes navigation controls and a stepper for multi-step forms.
 * Integrated with react-hook-form for state management.
 */
const Form: FC<TFormProps> = ({ schema, path }) => {
  const { subtitle, steps, multistep = false } = schema;
  const {
    context,
    initialData,
    activeStep,
    isLastStep,
    onSubmit,
    stepperMetadata,
    renderWithFormTag,
    successRenderer,
    submitting,
  } = useFormIntegrations();

  const StepperRenderer = useRenderer('stepper') as FC<TStepperRendererProps>;

  const methods = useForm<FieldValues>({
    defaultValues: {
      ...(initialData ?? {}),
      ...(context && { [CONTEXT_REFERENCE.value]: context }),
    },

    mode: 'onSubmit',
  });

  const handleSubmit = useCallback<SubmitHandler<FieldValues>>(data => onSubmit?.(data), [onSubmit]);

  return (
    <Box>
      <FormProvider {...methods}>
        <WithFormTag onSubmit={methods.handleSubmit(handleSubmit)} withFormTag={renderWithFormTag}>
          <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography component="h1" fontWeight={500} variant="h4">
                {schema.title}
              </Typography>
              {subtitle && (
                <Typography color="text.secondary" variant="body2">
                  {subtitle}
                </Typography>
              )}
            </Box>

            {multistep &&
              (StepperRenderer ? (
                <StepperRenderer activeStepId={steps[activeStep]?.id} stepperMetadata={stepperMetadata} />
              ) : (
                <Box sx={{ display: 'flex' }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {stepperMetadata.map(step => (
                      <StepFromMUI key={step.id}>
                        <StepLabel>
                          <Typography variant="body2">{step.title}</Typography>
                        </StepLabel>
                      </StepFromMUI>
                    ))}
                  </Stepper>
                </Box>
              ))}

            {steps[activeStep] && (
              <Box sx={{ width: '100%' }}>
                <StepContext value={{ stepId: steps[activeStep].id, stepIndex: activeStep }}>
                  <Step key={steps[activeStep]?.id} path={path} schema={steps[activeStep]} />
                </StepContext>
              </Box>
            )}

            {activeStep === steps.length ? <Review config={schema.review} /> : null}

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
              {multistep && <Back />}
              <Save />
              {multistep && <Next />}

              {isLastStep && (
                <Button
                  color="primary"
                  disabled={!!successRenderer || submitting}
                  loading={submitting}
                  onClick={methods.handleSubmit(handleSubmit)}
                  type="submit"
                  variant="contained"
                >
                  Submit
                </Button>
              )}
            </Box>
          </Box>
        </WithFormTag>
      </FormProvider>
    </Box>
  );
};

export default memo(Form);
