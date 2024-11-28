import { Injectable } from '@nestjs/common';
import EventsSchema from '@SecondaryAdapters/db/mysql/schemas/events.schema';
import Event from '@Domain/sharedKernel/entities/event.entity';

@Injectable()
export default class EventFactory {
  public buildByMySQLRecord(dbRecord: EventsSchema): Event {
    if (!dbRecord) {
      return null;
    }
    return new Event();
  }
}
