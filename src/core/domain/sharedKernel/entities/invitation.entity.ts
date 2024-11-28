import User from './user.entity';
import Group from './group.entity';
import { InvitationStatus } from '@Domain/sharedKernel/entities/types/invitationStatus.enum';

export default class Invitation {
  id: number;
  link: string;
  inviter: User;
  invitee: User;
  relatedGroup: Group;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
