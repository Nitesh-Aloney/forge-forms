import { Button } from '@mui/material';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormIntegrations } from '@/hooks/useFormIntegrations';

const Save = () => {
  const { getValues } = useFormContext();
  const { activeStep, isReviewStep, onSave, saving, hideSave } = useFormIntegrations();

  const handleSaveDraft = useCallback(() => {
    const formData = getValues();
    onSave?.({ activeStepIdx: activeStep, formData });
  }, [onSave, activeStep, getValues]);

  if (!onSave || hideSave?.({ activeStep }) || isReviewStep) return null;

  return (
    <Button disabled={saving} loading={saving} onClick={handleSaveDraft} variant="outlined">
      Save
    </Button>
  );
};

export default Save;
