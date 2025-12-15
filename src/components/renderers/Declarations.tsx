import { Alert, Box, Checkbox, FormControl, FormControlLabel, FormHelperText, Stack, Typography } from '@mui/material';
import { type FC, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { TDeclaration } from '@/schemas/form-entites/declarations';
import { DECLARATION_REFERENCE } from '@/schemas/form-entites/special-keywords';

interface TDeclarationsProp {
  declaration: TDeclaration;
}

const DeclarationItem: FC<TDeclarationsProp> = ({ declaration }) => {
  const { control } = useFormContext();
  const fieldName = `${DECLARATION_REFERENCE.value}.${declaration.propertyPath}`;

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth>
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value || false}
                color="primary"
                name={field.name}
                onChange={event => field.onChange(event.target.checked)}
              />
            }
            label={
              <Box sx={{ alignItems: 'center', display: 'flex' }}>
                <Typography component="span" variant="body2">
                  {declaration.label}
                  {declaration.required && (
                    <Typography color="error" component="span">
                      &nbsp;*
                    </Typography>
                  )}
                </Typography>
              </Box>
            }
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
      rules={{
        required: declaration.required ? { message: 'This declaration is required', value: true } : false,
      }}
    />
  );
};

interface TDeclarationsProps {
  declarations: TDeclaration[];
}

const Declarations: FC<TDeclarationsProps> = ({ declarations }) => {
  const { formState } = useFormContext();
  const declarationErrorsInFormState = formState.errors?.[DECLARATION_REFERENCE.value];

  const declarationErrors = useMemo(() => {
    if (!declarationErrorsInFormState) return [];

    return declarations.filter(declaration => {
      const declarationsErrors = declarationErrorsInFormState as Record<string, unknown>;
      const fieldError = declarationsErrors?.[declaration.id];
      return declaration.required && fieldError;
    });
  }, [declarations, declarationErrorsInFormState]);

  if (!declarations.length) {
    return null;
  }

  return (
    <Stack spacing={2}>
      {declarationErrors.length > 0 && (
        <Alert severity="error">
          <Typography variant="body2">Please complete all required declarations</Typography>
        </Alert>
      )}

      <Box>
        <Typography fontWeight={600} gutterBottom variant="h6">
          Declarations
        </Typography>

        <Stack>
          {declarations.map(declaration => (
            <DeclarationItem declaration={declaration} key={declaration.id} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default Declarations;
