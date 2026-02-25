import { Module } from '@nestjs/common';
import { SecurityController } from './security​.controller';
import { SecurityService } from './security.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './auth-strategy/local.strategy';
import { JwtStrategy } from './auth-strategy/jwt.strategy';


@Module({
    imports: [JwtModule.registerAsync({
        useFactory: async (configService : ConfigService) => {
            return {
                secret: configService.get('WEBLOG_SECRET_KEY'),
                signOptions: { expiresIn: '1d' },
            }
        },
        inject: [ConfigService]
    })
],
    controllers: [SecurityController],
    providers:[SecurityService , LocalStrategy, JwtStrategy],
    exports: [SecurityService , LocalStrategy, JwtStrategy]
})
export class SecurityModule {}
