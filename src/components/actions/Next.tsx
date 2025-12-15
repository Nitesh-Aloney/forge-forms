import { Button } from '@mui/material';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormIntegrations } from '@/hooks/useFormIntegrations';
import { getFieldsForStep } from '@/utils';

const Next = () => {
  const { trigger, getValues } = useFormContext();
  const { activeStep, fieldMappings, hideNext, isLastStep, isNextStepReview, nextStep, onNext, schema, saving } =
    useFormIntegrations();
  const { steps } = schema;

  const handleNext = useCallback(() => {
    const currentStepSchema = steps[activeStep];
    const fieldsToValidate = getFieldsForStep(currentStepSchema.id, fieldMappings);
    trigger(fieldsToValidate).then(isValid => {
      if (!isValid) return;
      onNext?.(getValues(), activeStep + 1);
      nextStep();
    });
  }, [activeStep, steps, nextStep, trigger, onNext, fieldMappings, getValues]);

  if (isLastStep || hideNext?.({ activeStep })) return null;

  return (
    <Button disabled={saving} onClick={handleNext} variant="contained">
      {isNextStepReview ? 'Review' : 'Next'}
    </Button>
  );
};

export default Next;
