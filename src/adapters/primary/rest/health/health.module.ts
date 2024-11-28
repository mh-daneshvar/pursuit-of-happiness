import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlDataSource } from '@Config/mysqlTypeorm.config';

@Module({
  imports: [
    HttpModule,
    TerminusModule,
    TypeOrmModule.forRoot(mysqlDataSource.options),
  ],
  controllers: [HealthController],
})
export default class HealthModule {}
