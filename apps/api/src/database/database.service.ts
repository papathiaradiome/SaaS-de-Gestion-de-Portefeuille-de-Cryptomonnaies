import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createDb, type Db } from './db';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly instance: Db;

  /** L'URL est injectable pour les tests (base en mémoire) ; défaut : variable d'env. */
  constructor(url?: string) {
    this.instance = createDb(url ?? process.env.DATABASE_URL ?? 'file:./data/dev.db');
  }

  /** Instance Drizzle typée — point d'entrée pour tous les modules. */
  get db(): Db {
    return this.instance;
  }

  onModuleDestroy(): void {
    this.instance.$client.close();
  }
}
