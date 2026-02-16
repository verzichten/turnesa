import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  statusCode: number;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse<ExpressResponse>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: unknown) => {
        const message =
          data && typeof data === 'object' && 'message' in data
            ? String(data.message)
            : 'Success';

        const resultData =
          data && typeof data === 'object' && 'data' in data
            ? (data.data as T)
            : (data as T);

        return {
          statusCode,
          message,
          data: resultData,
        };
      }),
    );
  }
}
