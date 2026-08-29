import { Global, Module } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';

@Global()
@Module({
  providers: [CoingeckoService],
  exports: [CoingeckoService],
})
export class CoinsModule {}
