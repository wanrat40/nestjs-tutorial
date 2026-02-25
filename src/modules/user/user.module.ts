import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SecurityModule } from '../security/security.module';


@Module({
    controllers: [UserController],
    providers:[UserService],
    imports: [SecurityModule]
   
})
export class UserModule {}
