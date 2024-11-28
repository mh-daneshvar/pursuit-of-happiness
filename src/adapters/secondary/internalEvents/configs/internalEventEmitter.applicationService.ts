import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { InternalDomainEvent } from '@Domain/sharedKernel/events/routes/internalDomainEvents.enum';
import BaseEvent from '@Domain/sharedKernel/events/base.event';

@Injectable()
export default class InternalEventEmitterApplicationService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public publish(
    eventName: InternalDomainEvent,
    context: string,
    event: BaseEvent,
  ): void {
    this.eventEmitter.emit(eventName, { context, event });
  }
}
