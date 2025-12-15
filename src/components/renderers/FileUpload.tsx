import { Box, Button, Typography } from '@mui/material';
import { type FC, memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DEFAULT_FILE_SIZE } from '@/constants';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useFormField } from '@/hooks/useFormField';
import { useValidations } from '@/hooks/useValidations';
import type { TFileUploadField } from '@/schemas/form-entites/form-fields';
import { colors } from '@/styles/colors';
import type { BaseRendererProps } from '@/types';
import { constructPropertyPath } from '@/utils';
import { convertFileSizeToBytes, isAllowedFileType, isFilesizeWithinLimit } from '@/utils/file';
import FieldTitle from './FieldTitle';

interface TFileUploadProps extends BaseRendererProps {
  schema: TFileUploadField;
}

/**
 * FileUpload Renderer Component
 *
 * Renders a file upload field based on the schema configuration.
 * Supports single or multiple file uploads with validations
 * Integrated with react-hook-form for form state management
 */
const FileUpload: FC<TFileUploadProps> = ({ schema, path }) => {
  const effectivePropertyPath = constructPropertyPath(schema.propertyPath, path);
  const { required, hide, disable } = useFormField();
  const { control } = useFormContext();
  const { isValid } = useValidations(schema.validations || [], effectivePropertyPath);

  if (hide) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <FieldTitle required={required} subtitle={schema.subtitle} title={schema.title} />
      <Controller
        control={control}
        name={effectivePropertyPath}
        render={({ field, fieldState: { error } }) => {
          const helperText = error?.message || schema.helperText;
          // biome-ignore lint/correctness/useHookAtTopLevel: false positive
          const { loading, data: fileIdFileNameTuples, error: uploadError, remove, upload } = useFileUpload(field);

          return (
            <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', py: 1, width: '100%' }}>
              <Box sx={{ display: 'flex', gap: '1rem', overflow: 'hidden', placeItems: 'center' }}>
                <Button component="label" disabled={loading || disable} sx={{ flexShrink: 0 }} variant="contained">
                  Upload
                  <input
                    accept={schema.accept?.join(', ')}
                    disabled={loading || disable || field.disabled}
                    hidden
                    id="file-input"
                    multiple={schema.multiple}
                    onChange={e => {
                      const fileList = e.target.files;
                      if (!fileList?.length) return;

                      if (
                        Array.from(fileList).every(file =>
                          isFilesizeWithinLimit(file, schema.maxSize ?? DEFAULT_FILE_SIZE) && schema.accept?.length
                            ? isAllowedFileType(file, schema.accept)
                            : true
                        )
                      ) {
                        upload(fileList);
                      }
                      e.target.value = '';
                    }}
                    size={convertFileSizeToBytes(schema.maxSize?.value, schema.maxSize?.unit)}
                    type="file"
                  />
                </Button>
                <Typography
                  color={loading ? colors['ink-blue'][50] : 'error'}
                  sx={{ display: 'flex', flexGrow: 1, gap: '0.25rem', placeItems: 'center' }}
                  variant="caption"
                >
                  {loading && (
                    <>
                      <img alt="uploading" src="/icons/uploading-ink-blue-50.svg" />
                      Uploading files...
                    </>
                  )}

                  {uploadError && (
                    <>
                      <img alt="submit failed" src="/icons/retry-red-40.svg" />
                      Upload failed
                    </>
                  )}
                </Typography>
              </Box>

              {fileIdFileNameTuples.length > 0 && !loading && !error && (
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.75rem', mt: { md: 0, xs: 1 } }}>
                  {fileIdFileNameTuples.map(([id, name]) => {
                    const removeFile = () => remove(id);
                    return (
                      <Typography
                        color={colors['ink-blue'][50]}
                        key={id}
                        sx={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}
                        variant="body2"
                      >
                        <img alt="attach file" src="/icons/attachment-ink-blue-50.svg" />
                        <Box
                          component="span"
                          sx={{
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={name || id}
                        >
                          {name || id}
                        </Box>
                        <img
                          alt="delete attachment"
                          onClick={removeFile}
                          onKeyDown={removeFile}
                          src="/icons/bin-red-10.svg"
                          style={{ cursor: 'pointer' }}
                        />
                      </Typography>
                    );
                  })}
                </Box>
              )}

              {(helperText || error) && (
                <Typography color="error" sx={{ display: 'block', pt: 0.5 }} variant="caption">
                  {helperText}
                </Typography>
              )}
            </Box>
          );
        }}
        rules={{
          required: required && `${schema.title} is required`,
          validate: (value, formValues) => (!schema.validations?.length ? true : isValid(value, formValues)),
        }}
        shouldUnregister={hide}
      />
    </Box>
  );
};

export default memo(FileUpload);
