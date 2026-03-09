import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { WebLogHeaderDto } from './dto/web-log-header.dto';
import { WebLogHeader } from 'src/models/web_log_headers';
import { BaseResponseDto } from 'src/base/dto/base-response.dto';
import { WEB_LOG_STATUS } from 'src/base/enum';
import { User } from 'src/models/user';
import { Attachment } from 'src/models/attachment';
import { WebLogAttachment } from 'src/models/web_log_attachment';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Injectable()
export class WebLogService {
  constructor(private readonly sequelize: Sequelize) {}

  async createWebLog( req: Request, webLogDto: WebLogHeaderDto, files,): Promise<BaseResponseDto<WebLogHeader>> {
    const response = new BaseResponseDto<WebLogHeader>();
    const data = {
      log_title: webLogDto.log_title,
      log_detail: webLogDto.log_detail,
      log_status: WEB_LOG_STATUS.PENDING,
      log_date: new Date(),
      log_created_user_id: (req.user as User).id,
    };
    try {
      //Open Transaction
      await this.sequelize.transaction(async (t) => {
        //1.save web log body
        const newWebLogHeader = await WebLogHeader.create(data as any, {
          transaction: t,
        });

        //2. save all file attachments and link to web log
        if (files?.files) {
          for (const file of files.files as Express.Multer.File[]) {
            //2.1 save file attachments
            const dataFile = {
              filename: file.filename,
              path: file.destination,
              file_size: file.size,
              original_file_name: file.originalname,
              mime_type: file.mimetype,
            };
            const newAttachment = await Attachment.create(dataFile as any, {
              transaction: t,
            });

            //2.2 link file attachment to web log
            const dataWebLogAttachment = {
              web_log_header_id: newWebLogHeader.id,
              attachment_id: newAttachment.id,
            };
            const newWebLogAttachment = await WebLogAttachment.create(
              dataWebLogAttachment as any,
              { transaction: t },
            );
          }
          response.status = true;
          response.payload = newWebLogHeader;
          response.message = 'Web log created successfully';
        }
      });
    } catch (error) {
      response.status = false;
      response.message = 'Failed to create web log';
      throw new BadRequestException(response);
    }
    // Implementation would go here
    return response;
  }

  async getWebLog(query: any): Promise<BaseResponseDto<WebLogHeader[]>> {
    const result = new BaseResponseDto<WebLogHeader[]>();

    let whereQuery = {};
    if (query.log_title) {
      whereQuery['log_title'] = { [Op.like]: `%${query.log_title}%` };
    }
    if (query.log_status) {
      whereQuery['log_status'] = query.log_status;
    }

    const webLogs = await WebLogHeader.findAll({
      where: whereQuery,
      include: [ //Like join query to get attachments for each web log
        {
          model: WebLogAttachment,
          include: [{
            model: Attachment,
          }],
        },
      ],
    });

    result.status = true;
    result.message = 'Web logs retrieved successfully';
    result.payload = webLogs;

    return result;
  }

  async getWebLogById(id: string): Promise<BaseResponseDto<WebLogHeader>> {
        const result = new BaseResponseDto<WebLogHeader>();
        const webLog = await WebLogHeader.findOne({ 
            where: { id: parseInt(id) },
            include: [{
                model: WebLogAttachment               
            }]        
        });

        result.status = true;
        result.message = 'Web log retrieved successfully';   
        result.payload = webLog;
        
        if (!webLog) {
            throw new Error('Web log not found');
        }
        return result;
    }
}
