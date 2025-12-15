import ResponseError from '@/schemas/errors/ResponseError';
import { StatusCode } from '@/schemas/http/StatusCode';

export async function parseResponse<Data>(res: Response) {
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let payload;

  if (res.status === StatusCode.NO_CONTENT) {
    // If status is 204 (i.e. response with no body), then set a resolved promise as the payload
    payload = Promise.resolve();
  } else {
    const text = await res.text();
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (res.ok) {
    return payload as Data;
  }

  throw new ResponseError(
    typeof payload === 'string' ? { message: payload, status: res.status } : { ...payload, status: res.status }
  );
}
