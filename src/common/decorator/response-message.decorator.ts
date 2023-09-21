import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (message: string | string[]) =>
  SetMetadata('response_message', message);
