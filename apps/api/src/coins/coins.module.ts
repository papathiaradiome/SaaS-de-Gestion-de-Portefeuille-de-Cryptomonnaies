import { Global, Module } from '@nestjs/common';
import { CoinsController } from './coins.controller';
import { CoingeckoService } from './coingecko.service';

@Global()
@Module({
  controllers: [CoinsController],
  providers: [CoingeckoService],
  exports: [CoingeckoService],
})
export class CoinsModule {}
