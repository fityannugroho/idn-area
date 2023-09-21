import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to unwrap response data.
 *
 * Without this decorator, the response will be wrapped in the `data` field.
 */
export const UnwrapResponse = (value = true) =>
  SetMetadata('unwrap_response', value);
