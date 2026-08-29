import { Controller, Get } from '@nestjs/common';
import { CurrentUser, type JwtPayload } from '../auth/current-user.decorator';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  /** Positions ouvertes agrégées par actif. */
  @Get('positions')
  positions(@CurrentUser() user: JwtPayload) {
    const { positions, snapshot } = this.portfolioService.getPositions(user.sub);
    return { positions, totalRealizedPnl: snapshot.totalRealizedPnl };
  }

  /** Résumé valorisé : PnL réalisé/latent, valeur totale, pondérations. */
  @Get('summary')
  summary(@CurrentUser() user: JwtPayload) {
    return this.portfolioService.getSummary(user.sub);
  }

  /** Historique de la valeur du portefeuille (approximé aux prix courants). */
  @Get('history')
  history(@CurrentUser() user: JwtPayload) {
    return this.portfolioService.getHistory(user.sub);
  }
}
