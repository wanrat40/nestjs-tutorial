import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from 'src/models/user';
import { BaseResponseDto } from 'src/base/dto/base-response.dto';
import * as bcrypt from 'bcrypt';
import { WebLogHeader } from 'src/models/web_log_headers';
import { WebLogAttachment } from 'src/models/web_log_attachment';

@Injectable()
export class UserService {
    async createUser(userDto: UserDto): Promise<BaseResponseDto<User>> {
        const result = new BaseResponseDto<User>();
        const data = {
            username: userDto.username,
            password: await bcrypt.hash(userDto.password, 10), //encode
            first_name: userDto.first_name,
            last_name: userDto.last_name,
            is_active: true,
        };

        try {
            const newUser = await User.create(data as any);
            result.status = true;
            result.message = 'User created successfully';   
            result.payload = newUser;  
            
        } catch (error) {
            result.status = false;
            result.message = error.message;
            throw new BadRequestException(result);
        }

        return result;
    }

    async updateUser(userDto: UserDto): Promise<User> {

        const user = await User.findOne({where : { id : userDto.id }});
        if (!user) {
            throw new Error('User not found');
        }
        const updatedUser = await user.update(userDto);
        return updatedUser;
    }

    async getUsers(): Promise<BaseResponseDto<User[]>> {
        const result = new BaseResponseDto<User[]>();
        const users = await User.findAll();
        
        result.status = true;
        result.message = 'Users retrieved successfully';   
        result.payload = users;

        return result;
    }

    async getUserById(id: string): Promise<BaseResponseDto<User>> {
        const result = new BaseResponseDto<User>();
        const user = await User.findOne({ 
            where: { id: parseInt(id) },
            include: [{
                model: WebLogHeader,
                include: [{
                    model: WebLogAttachment
                }]
            }]        
        });

        result.status = true;
        result.message = 'User retrieved successfully';   
        result.payload = user;
        
        if (!user) {
            throw new Error('User not found');
        }
        return result;
    }
}
