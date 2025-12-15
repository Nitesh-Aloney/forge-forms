import { type FC, type PropsWithChildren, useMemo } from 'react';
import { useFieldMapping } from '@/hooks/useFieldMapping';
import { FormIntegrationsContext, type TFormIntegrationsContext } from '@/hooks/useFormIntegrations';
import { useStepControls } from '@/hooks/useStepControls';

type TFormIntegrationsProviderProps = PropsWithChildren &
  Pick<
    TFormIntegrationsContext,
    | 'onSubmit'
    | 'submitErrors'
    | 'submitting'
    | 'saving'
    | 'saveFormError'
    | 'plugins'
    | 'context'
    | 'initialData'
    | 'initialStep'
    | 'onNext'
    | 'onPrev'
    | 'onSave'
    | 'schema'
    | 'renderWithFormTag'
    | 'successRenderer'
    | 'hideNext'
    | 'hidePrev'
    | 'hideSave'
  >;

const FormIntegrationsProvider: FC<TFormIntegrationsProviderProps> = ({
  schema,
  initialData,
  initialStep,
  context,
  plugins,
  submitErrors,
  submitting,
  saving,
  saveFormError,
  successRenderer,
  onSubmit,
  onNext,
  onPrev,
  onSave,
  children,
  renderWithFormTag,
  hideNext,
  hidePrev,
  hideSave,
}) => {
  const {
    activeStep,
    goto,
    nextStep,
    prevStep,
    stepperMetadata,
    totalSteps,
    isFirstStep,
    isLastStep,
    isNextStepReview,
    isReviewStep,
  } = useStepControls(schema, initialStep);
  const { addFieldMapping, removeFieldMappings, fieldMappings } = useFieldMapping();

  return (
    <FormIntegrationsContext
      value={useMemo(
        () => ({
          activeStep,
          addFieldMapping,
          context,

          fieldMappings,
          goto,
          hideNext,
          hidePrev,
          hideSave,
          initialData,
          isFirstStep,
          isLastStep,
          isNextStepReview,
          isReviewStep,
          nextStep,
          onNext,
          onPrev,
          onSave,
          onSubmit,
          plugins,
          prevStep,
          removeFieldMappings,
          renderWithFormTag,
          saveFormError,
          saving,
          schema,
          stepperMetadata,
          submitErrors,
          submitting,
          successRenderer,
          totalSteps,
        }),
        [
          schema,
          context,
          initialData,
          onNext,
          onPrev,
          onSave,
          onSubmit,
          submitting,
          submitErrors,
          saving,
          saveFormError,
          successRenderer,
          plugins,
          renderWithFormTag,

          hideNext,
          hidePrev,
          hideSave,
          fieldMappings,
          addFieldMapping,
          removeFieldMappings,
          activeStep,
          stepperMetadata,
          goto,
          nextStep,
          prevStep,
          totalSteps,
          isFirstStep,
          isLastStep,
          isNextStepReview,
          isReviewStep,
        ]
      )}
    >
      {children}
    </FormIntegrationsContext>
  );
};

export default FormIntegrationsProvider;
