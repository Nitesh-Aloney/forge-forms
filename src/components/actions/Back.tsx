import { Button } from '@mui/material';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormIntegrations } from '@/hooks/useFormIntegrations';

const Back = () => {
  const { getValues } = useFormContext();
  const { hidePrev, isFirstStep, onPrev, prevStep, activeStep } = useFormIntegrations();

  const handlePrev = useCallback(() => {
    onPrev?.(getValues(), activeStep - 1);
    prevStep();
  }, [prevStep, onPrev, getValues, activeStep]);

  if (isFirstStep || hidePrev?.({ activeStep })) return null;

  return (
    <Button onClick={handlePrev} variant="text">
      Back
    </Button>
  );
};

export default Back;
