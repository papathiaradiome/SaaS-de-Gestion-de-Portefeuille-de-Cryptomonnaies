import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { toSafeUser } from './safe-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const { accessToken, refreshToken, user } = await this.authService.registerAndLogin(dto);
    return { accessToken, refreshToken, user: toSafeUser(user) };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);
    return { accessToken, refreshToken, user: toSafeUser(user) };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken).then(({ accessToken, refreshToken, user }) => ({
      accessToken,
      refreshToken,
      user: toSafeUser(user),
    }));
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() dto: RefreshDto): Promise<void> {
    await this.authService.logout(dto.refreshToken);
  }
}
