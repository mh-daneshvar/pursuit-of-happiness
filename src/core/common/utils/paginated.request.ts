import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatedRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size = 10;
}

export function extractPaginatedRequest(
  request: PaginatedRequest,
): PaginatedRequest {
  const { page, size } = request;
  return { page, size };
}
