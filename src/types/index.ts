import type { FieldValues } from 'react-hook-form';
import type { useStepControls } from '@/hooks/useStepControls';
import type { TSectionElement, TStaticSectionElement, TStepElement } from '@/schemas/form-entites/layout';
import type { TOptionItem } from '@/schemas/form-entites/option';

/**
 * Base props for all dynamic form renderer components
 * Provides propertyPath which tracks the path to each field in the form
 */
export interface BaseRendererProps {
  /**
   * The path to the property in the form data structure
   * For nested objects this would be in dot notation (e.g., 'person.address.street')
   */
  path?: string;
}

/**
 * Base props for section renderer components
 */
export type BaseSectionProps<S extends TSectionElement> = BaseRendererProps & {
  schema: S;
  expanded?: boolean;
  onExpansionChange?: (id?: string) => void;
};

export type TFormValue = string | number | boolean | string[] | number[];

export type TValidationFunctionSignature<T, J = FieldValues> = (
  validationSchema: T,
  value: unknown,
  formValues: J
) => string | undefined;

export type TCustomFunctionSignature<R = unknown> = (value: unknown, formValues: FieldValues) => R;

export type FileIDFileNameTuple = [fileId: string, filename: string];

export type TStepperItem = { id: string; title: string | undefined };
/**
 * Renderer component types for form integrations
 */
export type TStepperRendererProps = {
  activeStepId: string;
  stepperMetadata: ReturnType<typeof useStepControls>['stepperMetadata'];
};

export type TStepperTitleRendererProps = {
  stepSchema: TStepElement;
};

export type THideButtonFunction = ({ activeStep }: { activeStep: number }) => boolean;

export type TOnNextFunction = (formData: FieldValues, to?: number) => Promise<void>;

export type TOnPrevFunction = (formData: FieldValues, to?: number) => Promise<void>;

export type TOnSaveFunction = (params: { formData: FieldValues; activeStepIdx: number }) => void;

export type TOnSubmitFunction = (formData: FieldValues) => Promise<void>;

export type TOnSaveParams = { formData: FieldValues; currStepId?: string };

export type TOptionProcessorFunctionSignature = <D = unknown>(data: D) => MaybePromise<TOptionItem[]>;

export type TLazySectionProcessorFunctionSignature = <D = unknown>(data: D) => MaybePromise<TStaticSectionElement>;
