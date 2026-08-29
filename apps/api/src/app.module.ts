import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CoinsModule } from './coins/coins.module';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    // Rate limiting global : 100 req/min par IP, resserré sur les endpoints d'auth.
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    TransactionsModule,
    PortfolioModule,
    CoinsModule,
    WatchlistModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Toutes les routes sont protégées par défaut ; @Public() pour les exempter.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
