import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { IsInt, IsPositive } from 'class-validator';
import { CurrentUser, type JwtPayload } from '../auth/current-user.decorator';
import { WatchlistService } from './watchlist.service';

class AddWatchlistDto {
  @IsInt()
  @IsPositive()
  assetId!: number;
}

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.watchlistService.list(user.sub);
  }

  @Post()
  add(@CurrentUser() user: JwtPayload, @Body() dto: AddWatchlistDto) {
    return this.watchlistService.add(user.sub, dto.assetId);
  }

  @Delete(':assetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('assetId', ParseIntPipe) assetId: number,
  ): void {
    this.watchlistService.remove(user.sub, assetId);
  }
}
