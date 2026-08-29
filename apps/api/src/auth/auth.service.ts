import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

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

  /** Vérifie les identifiants et émet un access token JWT. */
  async login(dto: LoginDto) {
    const { db } = this.database;
    const email = dto.email.toLowerCase().trim();

    const user = db.select().from(users).where(eq(users.email, email)).get();
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      // Message volontairement générique (pas de divulgation de l'existence du compte).
      throw new UnauthorizedException('Identifiants invalides');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { accessToken, user };
  }
}
