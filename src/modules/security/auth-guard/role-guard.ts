import { CanActivate, ExecutionContext,Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { request } from "http";
import { Observable } from "rxjs";
import { USER_ROLE } from "src/base/enum";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private  readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<USER_ROLE[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if(!roles.find(role => {return user.role == role})){
            throw new UnauthorizedException('Unauthorized');
        }
        return true;
    }
}