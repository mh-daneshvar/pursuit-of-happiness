import { Injectable } from '@nestjs/common';
import Invitation from '@Domain/sharedKernel/entities/invitation.entity';
import { InvitationStatus } from '@Domain/sharedKernel/entities/types/invitationStatus.enum';
import User from '@Domain/sharedKernel/entities/user.entity';
import Group from '@Domain/sharedKernel/entities/group.entity';

@Injectable()
export default class InvitationFactory {
  public new(inviter: User, invitee: User, relatedGroup: Group): Invitation {
    const i = new Invitation();
    i.link = `https://somehow-generate-a-unique-link.com/${Date.now()}`;
    i.inviter = inviter;
    i.invitee = invitee;
    i.relatedGroup = relatedGroup;
    i.status = InvitationStatus.SENT;
    return i;
  }
}
