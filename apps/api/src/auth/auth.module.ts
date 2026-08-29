import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: (): JwtModuleOptions => ({
        secret: process.env.JWT_ACCESS_SECRET ?? 'dev-insecure-secret',
        signOptions: {
          expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as NonNullable<
            JwtModuleOptions['signOptions']
          >['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
