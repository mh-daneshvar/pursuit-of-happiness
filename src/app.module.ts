import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import mysqlTypeormConfig, {
  mysqlDataSource,
} from './config/mysqlTypeorm.config';
import RestPrimaryModule from '@PrimaryAdapters/rest/restPrimary.module';
import InternalEventsModule from '@SecondaryAdapters/internalEvents/internalEvents.module';

@Module({
  imports: [
    // COMMON TOOLS -----------------------------
    InternalEventsModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [mysqlTypeormConfig],
    }),
    // MYSQL ADAPTER ----------------------------
    TypeOrmModule.forRoot(mysqlDataSource.options),
    // REST ADAPTER -----------------------------
    RestPrimaryModule,
  ],
})
export class AppModule {}
