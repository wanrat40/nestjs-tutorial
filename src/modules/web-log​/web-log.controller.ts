import { Controller, Post, UseGuards, Get, Request, Body, UseInterceptors, UploadedFiles, Query, Param } from '@nestjs/common';
import { WebLogService } from './web-log.service';
import { JwtAuthGuard } from '../security/auth-guard/jwt-auth.guard';
import { WebLogHeader } from 'src/models/web_log_headers';
import { BaseResponseDto } from 'src/base/dto/base-response.dto';
import { WebLogHeaderDto } from './dto/web-log-header.dto';
import { v4 as uuidv4 } from 'uuid';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { Roles } from 'src/base/decorator/role.decorator';
import { USER_ROLE } from 'src/base/enum';
import { RolesGuard } from '../security/auth-guard/role-guard';

@Controller('web-log')
export class WebLogController {
    constructor(private readonly webLogService: WebLogService){}

    @Roles(USER_ROLE.ADMIN, USER_ROLE.VIEWER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/')
    getWebLogs(@Query() query: any): Promise<BaseResponseDto<WebLogHeader[]>> {
        return this.webLogService.getWebLog(query);
    }

    @Roles(USER_ROLE.ADMIN, USER_ROLE.VIEWER)
    @UseGuards(JwtAuthGuard, RolesGuard)    
    @Get('/:id')
    async getWebLogById(@Param('id') id: string){  
        console.log('id', id);      
        return await this.webLogService.getWebLogById(id);
    }

    @Roles(USER_ROLE.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/create')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'files', maxCount: 10 },
        ], {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const rootUpLoadPath = `${process.env.UPLOAD_FOLDER}/`;
                    if (!existsSync(rootUpLoadPath)) {
                        mkdirSync(rootUpLoadPath, );
                    }
                    cb(null, rootUpLoadPath);
                },
                filename: (req, file, cb) => {
                    const fileExtension = extname(file.originalname);
                    const randomName = uuidv4();
                    cb(null, `${file.fieldname}-${randomName}${fileExtension}`);
                },
            }),
        })
    )
    createWebLog(@Request() req, @Body() body, @UploadedFiles() files: any[]): Promise<BaseResponseDto<WebLogHeader>> {
        const webLogDto = JSON.parse(body.data);
        return this.webLogService.createWebLog(req, webLogDto, files);
    }

    

}
