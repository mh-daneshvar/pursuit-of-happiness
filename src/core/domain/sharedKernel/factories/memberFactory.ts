import { Injectable } from '@nestjs/common';
import Member from '@Domain/sharedKernel/entities/member.entity';
import Invitation from '@Domain/sharedKernel/entities/invitation.entity';
import Group from '@Domain/sharedKernel/entities/group.entity';
import User from '@Domain/sharedKernel/entities/user.entity';

@Injectable()
export default class MemberFactory {
  public buildByInvitation(invitation: Invitation): Member {
    const m = new Member();
    m.group = invitation.relatedGroup;
    m.user = invitation.invitee;
    return m;
  }

  public buildByOwner(author: User, group: Group): Member {
    const m = new Member();
    m.group = group;
    m.user = author;
    return m;
  }
}
