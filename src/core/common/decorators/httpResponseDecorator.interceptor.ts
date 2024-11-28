import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

export interface OFoodResponse<T> {
  status_code?: number;
  message?: string;
  total?: number;
  data?: T;
  meta?: PaginationMeta;
  links?: PaginationLinks;
}

interface PaginationMeta {
  total_items: number;
  items_per_page: number;
  current_page: number;
  total_pages: number;
}

interface PaginationLinks {
  first: string;
  previous?: string;
  current: string;
  next?: string;
  last: string;
}

@Injectable()
export class HttpResponseDecorator<T>
  implements NestInterceptor<T, OFoodResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<OFoodResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((controllerResponse: any) => {
        const {
          status_code = HttpStatus.OK,
          message,
          total,
          data,
        } = controllerResponse;
        response.statusCode = status_code;

        return {
          status_code,
          message: this.getMessage(status_code, message),
          data,
          ...(total && total >= 0
            ? {
                meta: this.createMeta(request, total),
                links: this.createLinks(request, total),
              }
            : {}),
        };
      }),
    );
  }

  private getMessage(statusCode: number, customMessage?: string): string {
    if (customMessage) return customMessage;
    if (statusCode >= 200 && statusCode < 300) return 'success';
    if (statusCode >= 300 && statusCode < 400) return 'redirect';
    if (statusCode >= 400 && statusCode < 500) return 'client error';
    return statusCode >= 500 ? 'server error' : 'unknown status';
  }

  private createMeta(request: Request, total: number): PaginationMeta {
    const itemsPerPage = Number(request.query.size) || 10;
    const currentPage = Number(request.query.page) || 1;
    return {
      total_items: total,
      items_per_page: itemsPerPage,
      current_page: currentPage,
      total_pages: Math.ceil(total / itemsPerPage),
    };
  }

  private createLinks(request: Request, total: number): PaginationLinks {
    const url = request.originalUrl.split('?')[0];
    const itemsPerPage = Number(request.query.size) || 10;
    const currentPage = Number(request.query.page) || 1;
    const lastPage = Math.ceil(total / itemsPerPage);

    return {
      first: `${url}?page=1&size=${itemsPerPage}`,
      previous:
        currentPage > 1
          ? `${url}?page=${currentPage - 1}&size=${itemsPerPage}`
          : undefined,
      current: `${url}?page=${currentPage}&size=${itemsPerPage}`,
      next:
        currentPage < lastPage
          ? `${url}?page=${currentPage + 1}&size=${itemsPerPage}`
          : undefined,
      last: `${url}?page=${lastPage}&size=${itemsPerPage}`,
    };
  }
}
