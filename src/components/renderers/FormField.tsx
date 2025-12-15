import { type FC, memo, useEffect, useMemo } from 'react';
import { useDisable } from '@/hooks/useDisable';
import { useFormIntegrations } from '@/hooks/useFormIntegrations';
import { useHide } from '@/hooks/useHide';
import { useRequired } from '@/hooks/useRequired';
import { useSection } from '@/hooks/useSection';
import { useStep } from '@/hooks/useStep';
import type { TFormFieldElement } from '@/schemas/form-entites/form-fields';
import type { BaseRendererProps } from '@/types';
import { constructPropertyPath } from '@/utils';
import FormFieldProvider from '../FormFieldContext';
import Checkbox from './Checkbox';
import DateField from './Date';
import Datetime from './Datetime';
import FileUpload from './FileUpload';
import Input from './Input';
import Radio from './Radio';
import RadioBinary from './RadioBinary';
import Select from './Select';
import Switch from './Switch';

interface TFormFieldProps extends BaseRendererProps {
  schema: TFormFieldElement;
}

/**
 * FormField Router Component
 *
 * A unified component for rendering different form field types
 * based on the fieldType in the schema.
 */
const FormField: FC<TFormFieldProps> = ({ schema, path }) => {
  const { sectionId, name } = useSection();
  const { stepId } = useStep();
  const { removeFieldMappings, addFieldMapping } = useFormIntegrations();
  const effectivePropertyPath = constructPropertyPath(schema.propertyPath, path);

  const required = useRequired(schema.required, effectivePropertyPath);
  const hide = useHide(schema.hide, effectivePropertyPath);
  const disable = useDisable(schema.disable, effectivePropertyPath);

  useEffect(() => {
    if (!hide) {
      addFieldMapping(effectivePropertyPath, {
        fieldName: schema.title,
        section: sectionId,
        sectionName: name ?? '',
        step: stepId,
      });
    } else {
      removeFieldMappings(effectivePropertyPath);
    }
  }, [hide, effectivePropertyPath, sectionId, stepId, addFieldMapping, removeFieldMappings, schema.title, name]);

  const content = useMemo(() => {
    if (hide) return null;

    switch (schema.fieldType) {
      case 'input':
        return <Input path={path} schema={schema} />;
      case 'select':
        return <Select path={path} schema={schema} />;
      case 'checkbox':
        return <Checkbox path={path} schema={schema} />;
      case 'radio-binary':
        return <RadioBinary path={path} schema={schema} />;
      case 'radio':
        return <Radio path={path} schema={schema} />;
      case 'switch':
        return <Switch path={path} schema={schema} />;
      case 'date':
        return <DateField path={path} schema={schema} />;
      case 'datetime':
        return <Datetime path={path} schema={schema} />;
      case 'file-upload':
        return <FileUpload path={path} schema={schema} />;
      default:
        return null;
    }
  }, [schema, path, hide]);

  return !content ? null : (
    <FormFieldProvider disable={disable} hide={hide} required={required}>
      {content}
    </FormFieldProvider>
  );
};

export default memo(FormField);
