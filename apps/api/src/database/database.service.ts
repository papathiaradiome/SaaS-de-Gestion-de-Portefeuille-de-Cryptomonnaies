import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createDb, type Db } from './db';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly instance: Db;

  constructor() {
    // Url pilotée par l'environnement — les tests posent DATABASE_URL avant l'instanciation.
    this.instance = createDb(process.env.DATABASE_URL ?? 'file:./data/dev.db');
  }

  /** Instance Drizzle typée — point d'entrée pour tous les modules. */
  get db(): Db {
    return this.instance;
  }

  onModuleDestroy(): void {
    this.instance.$client.close();
  }
}
