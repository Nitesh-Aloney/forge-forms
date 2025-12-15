import { useCallback, useMemo, useState } from 'react';
import type { TFormElement } from '../schemas/form-entites/form';
import type { TStepperItem } from '../types';

export function useStepControls(formSchema: TFormElement, initStep = 0) {
  const { steps, multistep = false, review } = formSchema;
  const [activeStep, setActiveStep] = useState(initStep);

  const stepperMetadata: TStepperItem[] = useMemo(() => {
    const stepperMetadata = steps.map(step => ({ id: step.id, title: step.title }));
    if (!review) return stepperMetadata;
    return stepperMetadata.concat({ id: 'review', title: 'Review' });
  }, [review, steps]);

  const totalSteps = stepperMetadata.length;
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === totalSteps - 1;
  const isReviewStep = !!review && multistep ? activeStep === totalSteps - 1 : false;
  const isNextStepReview = !!review && multistep ? activeStep === steps.length - 1 : false;

  const nextStep = useCallback(() => {
    if (isLastStep) return;
    setActiveStep(prev => prev + 1);
  }, [isLastStep]);

  const prevStep = useCallback(() => {
    if (isFirstStep) return;
    setActiveStep(prev => Math.max(prev - 1, 0));
  }, [isFirstStep]);

  const goto = useCallback(
    (stepId: string) => {
      const stepIndex = steps.findIndex(step => step.id === stepId);
      if (stepIndex === -1) return;
      setActiveStep(stepIndex);
    },
    [steps]
  );

  return {
    activeStep,
    goto,
    isFirstStep,
    isLastStep,
    isNextStepReview,
    isReviewStep,
    nextStep,
    prevStep,
    stepperMetadata,
    totalSteps,
  };
}
