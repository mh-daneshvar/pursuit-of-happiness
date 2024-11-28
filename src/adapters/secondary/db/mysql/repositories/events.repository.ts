import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import EventsSchema from '@SecondaryAdapters/db/mysql/schemas/events.schema';
import Event from '@Domain/sharedKernel/entities/event.entity';
import EventFactory from '@Domain/sharedKernel/factories/event.factory';

@Injectable()
export default class EventsRepository {
  constructor(
    @InjectRepository(EventsSchema)
    private readonly eventsDAL: Repository<Event>,
    private readonly eventFactory: EventFactory,
  ) {}
}
