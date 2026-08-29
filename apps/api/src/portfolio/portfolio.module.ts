import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PnlService } from './pnl.service';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService, PnlService],
  exports: [PnlService, PortfolioService],
})
export class PortfolioModule {}
