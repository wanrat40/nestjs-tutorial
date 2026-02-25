
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SecurityService } from "../security.service";
import { ExtractJwt,Strategy } from "passport-jwt";
import { config } from "process";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly securityService: SecurityService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('WEBLOG_SECRET_KEY') || 'default-secret',
        })
    }

    async validate(jwtPayload: any) {
        const user = await this.securityService.validateJwtUser(jwtPayload);

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}