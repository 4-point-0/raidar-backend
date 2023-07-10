import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<TData> {
  constructor(
    total: number,
    count: number,
    results: TData[],
    take?: number,
    skip?: number,
  ) {
    this.take = take;
    this.skip = skip;
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
  take: number;

  @ApiProperty({
    type: Number,
  })
  skip: number;

  @ApiProperty({
    type: Number,
  })
  count: number;

  @ApiProperty({
    type: 'array',
  })
  results: TData[];
}
