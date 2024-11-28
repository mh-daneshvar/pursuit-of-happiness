import { Module } from '@nestjs/common';
import DBModule from '@SecondaryAdapters/db/db.module';
import DomainModule from '@Domain/domain.module';

@Module({
  imports: [DBModule, DomainModule],
  controllers: [],
  providers: [],
})
export default class TimelineModule {}
