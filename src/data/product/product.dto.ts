import { ApiPropertyOptional } from '@nestjs/swagger';

export class DetailProductDto {
  @ApiPropertyOptional()
  size: string;
  @ApiPropertyOptional()
  price: number;
}

export class ProductDto {
  @ApiPropertyOptional()
  name: string;
  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        size: { type: 'string' },
        price: { type: 'number' },
      },
    },
  })
  detail: DetailProductDto[];
  @ApiPropertyOptional()
  description: string;
  @ApiPropertyOptional()
  images: string[];
}

export class QueryFilter {
  @ApiPropertyOptional()
  limit: number;
  @ApiPropertyOptional()
  offset: number;
  @ApiPropertyOptional()
  keyword: string;
  @ApiPropertyOptional()
  size: string;
  @ApiPropertyOptional()
  minPrice: number;
  @ApiPropertyOptional()
  maxPrice: number;
  @ApiPropertyOptional()
  price: number;
  @ApiPropertyOptional()
  name: string;
  @ApiPropertyOptional({ type: 'enum', enum: { true: 'true', false: 'false' } })
  sortPrice: string;
  @ApiPropertyOptional({ type: 'enum', enum: { true: 'true', false: 'false' } })
  sortCreatedAt: string;
  @ApiPropertyOptional({ type: 'enum', enum: { true: 'true', false: 'false' } })
  sortUpdatedAt: string;
}
