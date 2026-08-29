import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { and, eq, lt } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { refreshTokens, users } from '../database/schema';
import type { User } from '../database/schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { generateRefreshToken, sha256 } from './token-utils';

const BCRYPT_ROUNDS = 10;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  /** Crée un compte, puis connecte directement l'utilisateur (paire de tokens). */
  async registerAndLogin(dto: RegisterDto) {
    const user = await this.register(dto);
    return this.issueTokens(user);
  }

  /** Crée un compte utilisateur. Lève ConflictException si l'email existe déjà. */
  async register(dto: RegisterDto): Promise<User> {
    const { db } = this.database;
    const email = dto.email.toLowerCase().trim();

    const existing = db.select().from(users).where(eq(users.email, email)).get();
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    return db
      .insert(users)
      .values({ email, passwordHash, displayName: dto.displayName ?? null })
      .returning()
      .get();
  }

  /** Vérifie les identifiants et émet une paire access/refresh tokens. */
  async login(dto: LoginDto) {
    const { db } = this.database;
    const email = dto.email.toLowerCase().trim();

    const user = db.select().from(users).where(eq(users.email, email)).get();
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      // Message volontairement générique (pas de divulgation de l'existence du compte).
      throw new UnauthorizedException('Identifiants invalides');
    }

    return this.issueTokens(user);
  }

  // ---------------------------------------------------------------------
  // Refresh tokens (opaques, hashés en base, avec rotation à chaque usage)
  // ---------------------------------------------------------------------

  /** Émet une paire (access JWT + refresh token persisté hashé). */
  private async issueTokens(user: User) {
    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    const refreshToken = await this.issueRefreshToken(user.id);
    return { accessToken, refreshToken, user };
  }

  /** Émet et persiste un nouveau refresh token pour l'utilisateur. */
  private async issueRefreshToken(userId: number): Promise<string> {
    const token = generateRefreshToken();
    const { db } = this.database;
    db.insert(refreshTokens)
      .values({
        userId,
        tokenHash: sha256(token),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      })
      .run();
    // Nettoyage opportuniste des tokens expirés du même utilisateur.
    db.delete(refreshTokens)
      .where(and(eq(refreshTokens.userId, userId), lt(refreshTokens.expiresAt, new Date())))
      .run();
    return token;
  }

  /** Rotation : consomme le refresh token fourni et émet une nouvelle paire. */
  async refresh(refreshToken: string) {
    const { db } = this.database;
    const tokenHash = sha256(refreshToken);

    const stored = db.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash)).get();
    if (!stored) {
      throw new UnauthorizedException('Refresh token invalide');
    }
    if (stored.expiresAt.getTime() < Date.now()) {
      db.delete(refreshTokens).where(eq(refreshTokens.id, stored.id)).run();
      throw new UnauthorizedException('Refresh token expiré');
    }

    const user = db.select().from(users).where(eq(users.id, stored.userId)).get();
    if (!user) {
      throw new UnauthorizedException('Refresh token invalide');
    }

    // Rotation : l'ancien token est révoqué, une nouvelle paire est émise.
    db.delete(refreshTokens).where(eq(refreshTokens.id, stored.id)).run();
    return this.issueTokens(user);
  }

  /** Révoque un refresh token (déconnexion). */
  async logout(refreshToken: string): Promise<void> {
    const { db } = this.database;
    db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, sha256(refreshToken))).run();
  }
}
