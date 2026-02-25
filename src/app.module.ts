import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ModelPack } from './base/model-pack';
import { SecurityModule } from './modules/security/security.module';
import { WebLogModule } from './modules/web-log​/web-log.module';


@Module({
  imports: [
    UserModule, 
    SecurityModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
    ,SequelizeModule.forRootAsync({
  useFactory: (config: ConfigService) => {
    return {
      models: ModelPack,
      dialect: 'postgres',      
      host: config.get('SEQUALIZE_HOST'),
      port: config.get('SEQUALIZE_PORT'),
      username: config.get('SEQUALIZE_USER'),
      password: config.get('SEQUALIZE_PASSWORD'),
      database: config.get('SEQUALIZE_DB_NAME'),
      synchronize: true,
      autoLoadModels: true,
      force: false,
      logging: false,
      // logging: (...msg) => console.log(new Date(), msg.toString()),
    }
  },
  inject: [ConfigService],
}), WebLogModule
  ]  
})
export class AppModule {}
