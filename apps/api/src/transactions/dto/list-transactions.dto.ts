import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { TRANSACTION_TYPES, type TransactionType } from '../../database/schema';
import { Type } from 'class-transformer';

export class ListTransactionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageSize?: number;

  @IsOptional()
  @IsString()
  @IsIn(TRANSACTION_TYPES as unknown as string[])
  type?: TransactionType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  assetId?: number;
}
