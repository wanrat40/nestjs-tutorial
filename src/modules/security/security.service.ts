import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user';
import { LoginResponseDto } from './dto/login-response.dto';
import { BaseResponseDto } from 'src/base/dto/base-response.dto';
import e from 'express';
import { log } from 'console';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async login(reqUser: any):Promise<BaseResponseDto<LoginResponseDto>> {
        
        const baseResponse = new BaseResponseDto<LoginResponseDto>();
        const loginResponse = new LoginResponseDto();
        const user = await User.findOne({ where: { username: reqUser.username } });
        

        if (!user) {
            baseResponse.status = false;
            baseResponse.message = 'User not found';
            baseResponse.payload = null;
        }else {
            loginResponse.username = user.username;
            loginResponse.jwt_token = this.jwtService.sign(
                user.toJSON(),{
                    secret: this.configService.get('WEBLOG_SECRET_KEY'),
                    expiresIn: '1d',
                }
            );
            baseResponse.status = true;
            baseResponse.message = 'Login successful';  
            baseResponse.payload = loginResponse;
        }

        
        return baseResponse;
    }

    async validateUser(username: string, password: string): Promise<User> {
        const user = await User.findOne({ where: { username: username } });       
        

        if (user){
            const plainUser = user.toJSON();
            // console.log('Validating user:', plainUser.username );
            const isPasswordValid = await bcrypt.compare(password, plainUser.password) ? true : false;
            if (isPasswordValid) {
                        return plainUser;
                    }else{
                        throw new Error('Invalid password');
                    }

        }else{
            throw new Error('User not found');
        }   
    }

    async validateJwtUser(jwtPayload: any): Promise<User> {
        const user = await User.findOne({ where: { username: jwtPayload.username } });

        if (!user) {
            throw new Error('User not found');
        }
        return user.toJSON();
    }

}
