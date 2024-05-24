import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './common/config/app.config';
import databaseConfig from './common/config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { paginatePlugin, searchPlugin } from './common/db-plugins';
import { DonationModule } from './donation/donation.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import paystackConfig from './common/config/paystack.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        paystackConfig
      ]
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.url'),
        connectionFactory: (connection) => {
          connection.plugin(paginatePlugin);
          connection.plugin(searchPlugin)
          Logger.log('DB CONNECTED')
          return connection
        }
      })
    }),

    DonationModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
