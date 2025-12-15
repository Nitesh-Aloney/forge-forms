import { Box } from '@mui/material';
import type { FC } from 'react';
import type { FieldValues } from 'react-hook-form';
import FormIntegrationsProvider from '@/components/FormIntegrations';
import Form from '@/components/renderers/Form';
import { useGetFormSchema } from '@/hooks/useGetFormSchema';
import * as optionProcessors from '@/utils/form-processors/options';
import * as sectionProcessors from '@/utils/form-processors/section';

const EmployeeOnboardingForm: FC = () => {
  const { formSchema } = useGetFormSchema('/examples/metadata/employee-onboarding.json');

  if (!formSchema) {
    return null;
  }

  return (
    <Box sx={{ margin: '0 auto', maxWidth: 800, padding: 2 }}>
      <FormIntegrationsProvider
        context={{
          bankDetailsSectionSchemaUrl: 'https://api.endpoint/metadata/bank-details-section.json',
        }}
        initialData={{
          email: 'john.doe@ms.com',
          firstName: 'John',
          lastName: 'Doe',
        }}
        initialStep={0}
        onNext={async (_data, _to) => {
          // you logic on next logic here
        }}
        onSave={(_data: FieldValues) => {
          // you data saving logic here
        }}
        onSubmit={async data => console.log(data)}
        plugins={{
          components: {
            // your custom components to render in LazySection for example
          },
          customFunctions: {
            // your custom functions, for validations etc.
          },
          file: {
            onDelete: async _fileId => {
              // your file delete logic here
            },
            onError: async _error => {
              // your file upload error handling logic here
            },
            onSuccess: async _result => {
              // your file upload success handling logic here
            },
            upload: async files => {
              // your file upload logic here
              return Array.from(files).map(file => [file.name, file.name]);
            },
          },
          processors: {
            // custom processors
            ...optionProcessors,
            ...sectionProcessors,
          },
          renderers: {
            // your custom renderers
            // stepper: Stepper,
            stepTitle: () => null,
          },
        }}
        schema={formSchema}
        successRenderer={
          undefined
          // any custom success renderer
          // successRenderer
        }
        // other states of usage
        // saving={saving}
        // submitErrors={submitErrors}
        // submitting={submitting}
      >
        <Form schema={formSchema} />
      </FormIntegrationsProvider>
    </Box>
  );
};

export default EmployeeOnboardingForm;
