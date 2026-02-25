import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { WebLogHeader } from "./web_log_headers";
import { Attachment } from "./attachment";

@Table({
    tableName: 'web_log_attachment',
    })
    export class WebLogAttachment extends Model<WebLogAttachment> {

        @ForeignKey(() => Attachment)
        @Column
        attachment_id : number;

        @BelongsTo(() => Attachment)
        attachment : Attachment;

        @ForeignKey(() => WebLogHeader)
        @Column
        web_log_header_id : number;

        @BelongsTo(() => WebLogHeader)
        web_log_header : WebLogHeader;     
    }