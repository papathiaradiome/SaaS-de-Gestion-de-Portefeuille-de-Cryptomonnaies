import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createDb, type Db } from './db';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly instance: Db;

  constructor() {
    const url = process.env.DATABASE_URL ?? 'file:./data/dev.db';
    this.instance = createDb(url);
  }

  /** Instance Drizzle typée — point d'entrée pour tous les modules. */
  get db(): Db {
    return this.instance;
  }

  onModuleDestroy(): void {
    this.instance.$client.close();
  }
}
