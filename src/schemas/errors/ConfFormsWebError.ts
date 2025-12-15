// Get From codegen
export type ErrorDetails = {
  code: string;
  description: string;
};

export type NFormifyWebErrorProps = {
  message?: string;
  code?: string;
  errors?: ErrorDetails[];
  retry?: () => void;
};

class ConfFormsWebError extends Error {
  code?: string;
  errors?: ErrorDetails[];
  retry?: NFormifyWebErrorProps['retry'];

  constructor({ message, code, errors, retry }: NFormifyWebErrorProps) {
    super(message);

    this.code = code || 'UNKNOWN';
    this.errors = errors;
    this.retry = retry;
  }

  toString() {
    return `ConfFormsWebError
      message: ${this.message}
      errors: ${this.errors?.map(error => `${error.code}: ${error.description}`).join(', ')}
      code: ${this.code}
    `;
  }
}

export default ConfFormsWebError;
