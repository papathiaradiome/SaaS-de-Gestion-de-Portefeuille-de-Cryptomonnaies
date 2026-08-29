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
import { TRANSACTION_TYPES } from '../../database/schema';

export class CreateTransactionDto {
  @IsInt({ message: 'assetId doit être un entier' })
  @IsPositive()
  assetId!: number;

  @IsIn(TRANSACTION_TYPES as unknown as string[])
  type!: 'buy' | 'sell' | 'transfer';

  /** Quantité : strictement positive (le type buy/sell/transfer détermine le sens). */
  @IsNumber({ maxDecimalPlaces: 18 })
  @IsPositive()
  quantity!: number;

  @IsNumber({ maxDecimalPlaces: 12 })
  @Min(0)
  pricePerUnit!: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 12 })
  @Min(0)
  fees?: number;

  @IsOptional()
  @IsNumber()
  executedAt?: number; // epoch ms

  @IsOptional()
  @IsString()
  @MaxLength(280)
  notes?: string;
}
