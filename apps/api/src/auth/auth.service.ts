import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly database: DatabaseService) {}

  /** Crée un compte utilisateur. Lève ConflictException si l'email existe déjà. */
  async register(dto: RegisterDto) {
    const { db } = this.database;
    const email = dto.email.toLowerCase().trim();

    const existing = db.select().from(users).where(eq(users.email, email)).get();
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const created = db
      .insert(users)
      .values({ email, passwordHash, displayName: dto.displayName ?? null })
      .returning()
      .get();

    return created;
  }
}
