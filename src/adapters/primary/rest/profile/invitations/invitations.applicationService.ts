import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import InternalEventEmitterApplicationService from '@SecondaryAdapters/internalEvents/configs/internalEventEmitter.applicationService';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import InvitationsRepository from '@SecondaryAdapters/db/mysql/repositories/invitations.repository';
import Invitation from '@Domain/sharedKernel/entities/invitation.entity';
import { InvitationStatus } from '@Domain/sharedKernel/entities/types/invitationStatus.enum';
import MembersRepository from '@SecondaryAdapters/db/mysql/repositories/members.repository';
import MemberFactory from '@Domain/sharedKernel/factories/memberFactory';
import PermissionsRepository from '@SecondaryAdapters/db/mysql/repositories/permissions.repository';
import PermissionFactory from '@Domain/sharedKernel/factories/permission.factory';
import Member from '@Domain/sharedKernel/entities/member.entity';

@Injectable()
export default class InvitationsApplicationService {
  private readonly logger = new Logger(InvitationsApplicationService.name);

  constructor(
    private readonly eventEmitter: InternalEventEmitterApplicationService,
    private readonly invitationsRepo: InvitationsRepository,
    private readonly membersRepository: MembersRepository,
    private readonly permissionsRepo: PermissionsRepository,
    private readonly memberFactory: MemberFactory,
    private readonly permissionFactory: PermissionFactory,
  ) {}

  public async getInvitations(
    userId: number,
    pagination: PaginatedRequest,
  ): Promise<[Invitation[], number]> {
    return this.invitationsRepo.findReceivedInvitations(userId, pagination);
  }

  public async handleInvitation(
    userId: number,
    invitationId: number,
    payload: any,
  ): Promise<Record<string, Invitation | Member>> {
    const { action } = payload;

    const invitation = await this.getValidatedInvitation(userId, invitationId);

    if (action === InvitationStatus.SENT || action === invitation.status) {
      return { invitation };
    }

    if (invitation.status === InvitationStatus.REJECTED) {
      throw new BadRequestException('Cannot update REJECTED invitations');
    }

    invitation.status = InvitationStatus[action];
    const updatedInvitation = await this.invitationsRepo.update(invitation);
    if (!updatedInvitation) {
      throw new BadRequestException('Failed to update invitation');
    }

    return this.handleUpdatedInvitation(updatedInvitation);
  }

  private async getValidatedInvitation(
    userId: number,
    invitationId: number,
  ): Promise<Invitation> {
    const invitation = await this.invitationsRepo.findReceivedInvitation(
      userId,
      invitationId,
    );

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    return invitation;
  }

  private async handleUpdatedInvitation(
    invitation: Invitation,
  ): Promise<Record<string, Invitation | Member>> {
    switch (invitation.status) {
      case InvitationStatus.OPENED:
        return { invitation };

      case InvitationStatus.ACCEPTED:
        return { membership: await this.createMembership(invitation) };

      default:
        throw new BadRequestException(
          `Unhandled invitation status: ${invitation.status}`,
        );
    }
  }

  private async createMembership(invitation: Invitation): Promise<Member> {
    const member = await this.membersRepository.create(
      this.memberFactory.buildByInvitation(invitation),
    );

    const groupPermissions = await this.permissionsRepo.findAllGroupPermissions(
      member.group,
    );

    await Promise.all(
      groupPermissions.map((gp) =>
        this.permissionsRepo.create(
          this.permissionFactory.cloneGroupPermission(member, gp),
        ),
      ),
    );

    return member;
  }
}
