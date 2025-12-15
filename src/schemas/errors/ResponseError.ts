import type { TConfFormsWebErrorProps } from './ConfFormsWebError';
import ConfFormsWebError from './ConfFormsWebError';

export type ResponseErrorProps = TConfFormsWebErrorProps & { status?: number };

class ResponseError extends ConfFormsWebError {
  status?: number;

  constructor({ status, ...rest }: ResponseErrorProps) {
    super(rest);
    this.status = status;
  }

  toString() {
    return `ResponseError
      status: ${this.status}
      message: ${this.message}
      errors: ${this.errors?.map(error => `${error.code}: ${error.description}`).join(', ')}
      code: ${this.code}
    `;
  }
}

export default ResponseError;
