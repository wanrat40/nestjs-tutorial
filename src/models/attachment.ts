import { Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'attachment' })
export class Attachment extends Model<Attachment> {
    @Column
    path: string;

    @Column
    filename: string;

    @Column
    original_file_name: string;

    @Column
    file_size: number;

    @Column
    mime_type: string;
}