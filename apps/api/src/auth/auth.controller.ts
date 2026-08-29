import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './public.decorator';
import { toSafeUser } from './safe-user';
import { ApiTags } from '@nestjs/swagger';

// Endpoints sensibles : 5 tentatives / minute / IP (anti brute-force).
const AUTH_THROTTLE = { default: { limit: 5, ttl: 60_000 } };

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle(AUTH_THROTTLE)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const { accessToken, refreshToken, user } = await this.authService.registerAndLogin(dto);
    return { accessToken, refreshToken, user: toSafeUser(user) };
  }

  @Public()
  @Throttle(AUTH_THROTTLE)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);
    return { accessToken, refreshToken, user: toSafeUser(user) };
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto) {
    return this.authService
      .refresh(dto.refreshToken)
      .then(({ accessToken, refreshToken, user }) => ({
        accessToken,
        refreshToken,
        user: toSafeUser(user),
      }));
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() dto: RefreshDto): Promise<void> {
    await this.authService.logout(dto.refreshToken);
  }
}
