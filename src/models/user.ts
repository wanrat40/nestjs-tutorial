import { Model, Table, Column, HasMany, DataType } from 'sequelize-typescript';
import { WebLogHeader } from './web_log_headers';
import { USER_ROLE } from 'src/base/enum';

@Table({ tableName: 'users' })
export class User extends Model<User> {   

    @Column({ unique: true })
    username: string;

    @Column
    password: string;

    @Column
    first_name: string;

    @Column
    last_name: string;

    @Column
    is_active: boolean;

    @Column({
        type : DataType.STRING(20)
    })
    role : USER_ROLE;

    @HasMany(() => WebLogHeader)
    web_log_headers: WebLogHeader[];
}