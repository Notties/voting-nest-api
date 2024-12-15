import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from 'src/env/env.module';
import { EnvService } from 'src/env/env.service';
import { AuthService } from './auth.service';

@Module({
  imports: [
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      useFactory: async (env: EnvService) => ({
        secret: env.JWT_CONFIG.secret,
        signOptions: {
          expiresIn: env.JWT_CONFIG.accessTokenExpiration,
        },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
