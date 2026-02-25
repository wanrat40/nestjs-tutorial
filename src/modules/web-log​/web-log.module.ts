import { Module } from '@nestjs/common';
import { WebLogService } from './web-log.service';
import { WebLogController } from './web-log.controller';

@Module({
  providers: [WebLogService],
  controllers: [WebLogController]
})
export class WebLogModule {}
