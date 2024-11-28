import { Injectable, Logger } from '@nestjs/common';
import InternalEventEmitterApplicationService from '@SecondaryAdapters/internalEvents/configs/internalEventEmitter.applicationService';
import { PaginatedRequest } from '@Common/utils/paginated.request';

@Injectable()
export default class MembersApplicationService {
  private readonly logger = new Logger();

  constructor(
    private readonly internalEventEmitter: InternalEventEmitterApplicationService,
  ) {}

  public async getActiveMembers(
    userId: number,
    groupId: number,
    pagination: PaginatedRequest,
  ): Promise<any> {
    // todo
  }

  public async deleteMember(
    userId: number,
    groupId: number,
    memberId: number,
  ): Promise<any> {
    // todo
  }
}
