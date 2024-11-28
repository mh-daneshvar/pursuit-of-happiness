import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import InternalEventEmitterApplicationService from '@SecondaryAdapters/internalEvents/configs/internalEventEmitter.applicationService';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import InvitationsRepository from '@SecondaryAdapters/db/mysql/repositories/invitations.repository';
import GroupsRepository from '@SecondaryAdapters/db/mysql/repositories/groups.repository';
import Invitation from '@Domain/sharedKernel/entities/invitation.entity';
import InvitationFactory from '@Domain/sharedKernel/factories/invitation.factory';
import UsersRepository from '@SecondaryAdapters/db/mysql/repositories/users.repository';
import { InvitationStatus } from '@Domain/sharedKernel/entities/types/invitationStatus.enum';

@Injectable()
export default class InvitationsApplicationService {
  private readonly logger = new Logger(InvitationsApplicationService.name);

  constructor(
    private readonly eventEmitter: InternalEventEmitterApplicationService,
    private readonly groupsRepo: GroupsRepository,
    private readonly invitationsRepo: InvitationsRepository,
    private readonly invitationFactory: InvitationFactory,
    private readonly usersRepo: UsersRepository,
  ) {}

  public async getInvitations(
    userId: number,
    groupId: number,
    pagination: PaginatedRequest,
  ): Promise<[Invitation[], number]> {
    const group = await this.groupsRepo.findMyOwnSingleGroup(userId, groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.invitationsRepo.findGroupInvitations(groupId, pagination);
  }

  public async sendInvitation(
    userId: number,
    groupId: number,
    payload: { user_id: number },
  ): Promise<Invitation> {
    const group = await this.groupsRepo.findMyOwnSingleGroup(userId, groupId);
    if (!group) throw new NotFoundException('Group not found');

    const { user_id: inviteeId } = payload;
    if (userId === inviteeId) {
      throw new BadRequestException('Cannot invite yourself');
    }

    const [inviter, invitee] = await Promise.all([
      this.usersRepo.findById(userId),
      this.usersRepo.findById(inviteeId),
    ]);

    const existingInvitation =
      await this.invitationsRepo.findGroupSentInvitation(group, invitee);
    if (existingInvitation) {
      return existingInvitation;
    }

    const invitation = this.invitationFactory.new(inviter, invitee, group);
    return this.invitationsRepo.create(invitation);
  }

  public async cancelInvitation(
    userId: number,
    groupId: number,
    invitationId: number,
  ): Promise<boolean> {
    const invitation = await this.invitationsRepo.findGroupInvitation(
      groupId,
      invitationId,
    );
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new BadRequestException('Cannot cancel an accepted invitation');
    }

    return this.invitationsRepo.delete(invitation);
  }
}
