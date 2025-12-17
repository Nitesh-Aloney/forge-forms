import type { TForgeFormsWebErrorProps } from './ForgeFormsWebError';
import ForgeFormsWebError from './ForgeFormsWebError';

export type ResponseErrorProps = TForgeFormsWebErrorProps & { status?: number };

class ResponseError extends ForgeFormsWebError {
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
