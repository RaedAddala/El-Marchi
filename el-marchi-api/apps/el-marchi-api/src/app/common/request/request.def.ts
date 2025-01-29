import { Request } from 'express';

export interface UsedRequest extends Request {
  userId: string | undefined;
}
