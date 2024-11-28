import BaseEvent from '@Domain/sharedKernel/events/base.event';

export default interface IBasePayload {
  context: string;
  event: BaseEvent;
}
