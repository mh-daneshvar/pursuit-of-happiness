import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import BaseRepository from '@SecondaryAdapters/db/mysql/repositories/base.repository';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import InvitationsSchema from '@SecondaryAdapters/db/mysql/schemas/invitations.schema';
import Invitation from '@Domain/sharedKernel/entities/invitation.entity';
import Group from '@Domain/sharedKernel/entities/group.entity';
import User from '@Domain/sharedKernel/entities/user.entity';
import { InvitationStatus } from '@Domain/sharedKernel/entities/types/invitationStatus.enum';

@Injectable()
export default class InvitationsRepository extends BaseRepository {
  constructor(
    @InjectRepository(InvitationsSchema)
    private readonly invitationsDAL: Repository<Invitation>,
  ) {
    super();
  }

  public async create(invitation: Invitation): Promise<Invitation> {
    return this.invitationsDAL.save(invitation);
  }

  public async update(invitation: Invitation): Promise<Invitation | null> {
    await this.invitationsDAL.update(
      { id: invitation.id },
      { status: invitation.status },
    );
    return await this.invitationsDAL.findOne({
      where: { id: invitation.id },
      relations: ['invitee', 'relatedGroup'],
    });
  }

  public async delete(invitation: Invitation): Promise<boolean> {
    const result = await this.invitationsDAL.softDelete({ id: invitation.id });
    return result.affected === 1;
  }

  public async findGroupInvitations(
    groupId: number,
    pagination: PaginatedRequest,
  ): Promise<[Invitation[], number]> {
    const [take, skip] = this.preparePagination(pagination);
    return this.invitationsDAL.findAndCount({
      where: { relatedGroup: { id: groupId } },
      relations: ['invitee'],
      take,
      skip,
    });
  }

  public async findGroupInvitation(
    groupId: number,
    invitationId: number,
  ): Promise<Invitation | null> {
    return this.invitationsDAL.findOne({
      where: { id: invitationId, relatedGroup: { id: groupId } },
      relations: ['inviter', 'invitee', 'relatedGroup'],
    });
  }

  public async findGroupSentInvitation(
    group: Group,
    invitee: User,
  ): Promise<Invitation | null> {
    return this.invitationsDAL.findOne({
      where: {
        status: Not(InvitationStatus.REJECTED),
        invitee: { id: invitee.id },
        relatedGroup: { id: group.id },
      },
      relations: ['inviter', 'invitee', 'relatedGroup'],
    });
  }

  public async findReceivedInvitations(
    inviteeId: number,
    pagination: PaginatedRequest,
  ): Promise<[Invitation[], number]> {
    const [take, skip] = this.preparePagination(pagination);
    return this.invitationsDAL.findAndCount({
      where: {
        status: Not(InvitationStatus.REJECTED),
        invitee: { id: inviteeId },
      },
      relations: ['relatedGroup'],
      take,
      skip,
    });
  }

  public async findReceivedInvitation(
    inviteeId: number,
    invitationId: number,
  ): Promise<Invitation | null> {
    return this.invitationsDAL.findOne({
      where: {
        status: Not(InvitationStatus.REJECTED),
        id: invitationId,
        invitee: { id: inviteeId },
      },
      relations: ['invitee', 'relatedGroup'],
    });
  }
}
