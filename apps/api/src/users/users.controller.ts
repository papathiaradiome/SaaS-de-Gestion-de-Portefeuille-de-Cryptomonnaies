import { Controller, Get, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema';
import { CurrentUser, type JwtPayload } from '../auth/current-user.decorator';
import { toSafeUser } from '../auth/safe-user';

@Controller('users')
export class UsersController {
  constructor(private readonly database: DatabaseService) {}

  /** Profil de l'utilisateur authentifié (GET /api/users/me). */
  @Get('me')
  me(@CurrentUser() payload: JwtPayload) {
    const { db } = this.database;
    const user = db.select().from(users).where(eq(users.id, payload.sub)).get();
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return toSafeUser(user);
  }
}
