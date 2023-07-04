import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<TData> {
  constructor(
    total: number,
    count: number,
    results: TData[],
    limit?: number,
    offset?: number,
  ) {
    this.limit = limit;
    this.offset = offset;
    this.total = total;
    this.count = count;
    this.results = results;
  }

  @ApiProperty({
    type: Number,
  })
  total: number;

  @ApiProperty({
    type: Number,
  })
  limit: number;

  @ApiProperty({
    type: Number,
  })
  offset: number;

  @ApiProperty({
    type: Number,
  })
  count: number;

  @ApiProperty({
    type: 'array',
  })
  results: TData[];
}
