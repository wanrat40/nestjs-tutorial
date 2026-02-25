import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../security/auth-guard/jwt-auth.guard';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/hello')
    helloWorld(){
        return 'Hello World';
    }

    @Post('/create')
    async createUser(@Body() body: UserDto){        
        return await this.userService.createUser(body);
    }

    @Patch('/update')
    async updateUser(@Body() body: UserDto){        
        return await this.userService.updateUser(body);
    }

    @Get('/all')
    async getUsers(){        
        return await this.userService.getUsers();
    }

    @Get('/:id')
    async getUserById(@Param('id') id: string){  
        console.log('id', id);      
        return await this.userService.getUserById(id);
    }
}
