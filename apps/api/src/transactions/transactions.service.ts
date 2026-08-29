import { BadRequestException, Injectable } from '@nestjs/common';
import { and, count, desc, eq, type SQL } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { assets, transactions, type TransactionType } from '../database/schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

const MAX_PAGE_SIZE = 100;

export interface ListTransactionsResult {
  data: Array<{
    id: number;
    type: string;
    quantity: number;
    pricePerUnit: number;
    fees: number;
    executedAt: Date;
    notes: string | null;
    asset: { id: number; symbol: string; name: string };
  }>;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

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

  /** Liste paginée des transactions de l'utilisateur, avec filtres type/actif. */
  async list(
    userId: number,
    options: { page?: number; pageSize?: number; type?: TransactionType; assetId?: number },
  ): Promise<ListTransactionsResult> {
    const { db } = this.database;
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, options.pageSize ?? 20));

    const filters: SQL[] = [eq(transactions.userId, userId)];
    if (options.type) filters.push(eq(transactions.type, options.type));
    if (options.assetId) filters.push(eq(transactions.assetId, options.assetId));
    const where = and(...filters);

    const [{ total }] = db
      .select({ total: count() })
      .from(transactions)
      .where(where)
      .all();

    const rows = db
      .select({
        id: transactions.id,
        type: transactions.type,
        quantity: transactions.quantity,
        pricePerUnit: transactions.pricePerUnit,
        fees: transactions.fees,
        executedAt: transactions.executedAt,
        notes: transactions.notes,
        assetId: assets.id,
        assetSymbol: assets.symbol,
        assetName: assets.name,
      })
      .from(transactions)
      .innerJoin(assets, eq(assets.id, transactions.assetId))
      .where(where)
      .orderBy(desc(transactions.executedAt), desc(transactions.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .all();

    return {
      data: rows.map((r) => ({
        id: r.id,
        type: r.type,
        quantity: r.quantity,
        pricePerUnit: r.pricePerUnit,
        fees: r.fees,
        executedAt: r.executedAt,
        notes: r.notes,
        asset: { id: r.assetId, symbol: r.assetSymbol, name: r.assetName },
      })),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }
}
