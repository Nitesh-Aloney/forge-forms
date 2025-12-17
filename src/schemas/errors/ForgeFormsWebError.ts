// Get From codegen
export type ErrorDetails = {
  code: string;
  description: string;
};

export type TForgeFormsWebErrorProps = {
  message?: string;
  code?: string;
  errors?: ErrorDetails[];
  retry?: () => void;
};

class FormsForgeWebError extends Error {
  code?: string;
  errors?: ErrorDetails[];
  retry?: TForgeFormsWebErrorProps['retry'];

  constructor({ message, code, errors, retry }: TForgeFormsWebErrorProps) {
    super(message);

    this.code = code || 'UNKNOWN';
    this.errors = errors;
    this.retry = retry;
  }

  toString() {
    return `ForgeFormsWebError
      message: ${this.message}
      errors: ${this.errors?.map(error => `${error.code}: ${error.description}`).join(', ')}
      code: ${this.code}
    `;
  }
}

export default FormsForgeWebError;
