import { EventableType } from '@Domain/sharedKernel/entities/types/eventableType.enum';
import { User } from '@sentry/node';
import { EventAction } from '@Domain/sharedKernel/entities/types/eventAction.enum';

export default class Event {
  id: number;
  eventableType: EventableType;
  eventableID: number;
  actor: User;
  action: EventAction;
  description: unknown;
  createdAt: Date;
}
