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
}
