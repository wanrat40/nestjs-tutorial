import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./user";
import { WEB_LOG_STATUS } from "src/base/enum";
import { WebLogAttachment } from "./web_log_attachment";


@Table({
    tableName: 'web_log_headers',
    })
    export class WebLogHeader extends Model<WebLogHeader> {

        @Column
        log_title : string;

        @Column
        log_detail : string;

        @Column
        log_status : WEB_LOG_STATUS;

        @Column
        log_date : Date;

        @ForeignKey(() => User)
        @Column
        log_created_user_id : number;

        @BelongsTo(() => User)
        log_created_user : User;

        @HasMany(() => WebLogAttachment)
        web_log_attachments : WebLogAttachment[];
    }