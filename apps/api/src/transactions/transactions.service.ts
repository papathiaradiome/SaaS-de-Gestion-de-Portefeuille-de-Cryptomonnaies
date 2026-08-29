import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { assets, transactions } from '../database/schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly database: DatabaseService) {}

  /** Crée une transaction pour l'utilisateur, après vérification de l'actif. */
  create(userId: number, dto: CreateTransactionDto) {
    const { db } = this.database;

    const asset = db.select().from(assets).where(eq(assets.id, dto.assetId)).get();
    if (!asset) {
      throw new BadRequestException(`Actif inconnu (id=${dto.assetId})`);
    }
    if (dto.type === 'sell' && dto.pricePerUnit < 0) {
      throw new BadRequestException('Le prix unitaire ne peut pas être négatif');
    }

    return db
      .insert(transactions)
      .values({
        userId,
        assetId: dto.assetId,
        type: dto.type,
        quantity: dto.quantity,
        pricePerUnit: dto.pricePerUnit,
        fees: dto.fees ?? 0,
        executedAt: dto.executedAt ? new Date(dto.executedAt) : new Date(),
        notes: dto.notes ?? null,
      })
      .returning()
      .get();
  }
}
