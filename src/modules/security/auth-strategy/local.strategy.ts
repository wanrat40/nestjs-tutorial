import { Strategy } from "passport-local"; 
import { PassportStrategy } from "@nestjs/passport";
import { Request, Injectable, UnauthorizedException } from "@nestjs/common";
import { SecurityService } from "../security.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private securityService: SecurityService) {
        super({ passReqToCallback: true});
        
    }

    async validate(@Request() request, username: string, password: string) {
        const user = await this.securityService.validateUser(username, password);

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}