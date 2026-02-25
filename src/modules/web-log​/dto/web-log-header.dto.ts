import { WEB_LOG_STATUS } from "src/base/enum";

export class WebLogHeaderDto {
    log_title : string;

    log_detail : string;

    log_status : WEB_LOG_STATUS;

    log_date : Date;
    
}