import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { TRANSACTION_TYPES, type TransactionType } from '../../database/schema';

/** Mêmes champs que CreateTransactionDto, tous optionnels (PATCH). */
export class UpdateTransactionDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  assetId?: number;

  @IsOptional()
  @IsIn(TRANSACTION_TYPES as unknown as string[])
  type?: TransactionType;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 18 })
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 12 })
  @Min(0)
  pricePerUnit?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 12 })
  @Min(0)
  fees?: number;

  @IsOptional()
  @IsNumber()
  executedAt?: number;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  notes?: string;
}
