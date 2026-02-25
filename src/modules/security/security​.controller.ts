import { Controller, UseGuards,Request, Post } from '@nestjs/common';
import { SecurityService } from './security.service';
import { LocalAuthGuard } from './auth-guard/local-auth.guard';
 

@Controller('security')
export class SecurityController {

    constructor(
        private readonly securityService: SecurityService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {               
        return await this.securityService.login(req.user);
    }
}
