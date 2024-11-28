import { PaginatedRequest } from '@Common/utils/paginated.request';
import { ConfigService } from '@nestjs/config';

export default class BaseRepository {
  protected preparePagination(pagination: PaginatedRequest): [number, number] {
    let page = pagination.page;
    if (!page || Number.isNaN(page)) {
      page = 1;
    }

    let size = pagination.size;
    if (!size || Number.isNaN(size)) {
      size = +new ConfigService().get<number>('PAGINATION_DEFAULT_SIZE');
    }

    return [size, (page - 1) * size];
  }
}
