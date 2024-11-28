import { Module } from '@nestjs/common';
import EventFactory from '@Domain/sharedKernel/factories/event.factory';
import GroupFactory from '@Domain/sharedKernel/factories/group.factory';
import MemberFactory from '@Domain/sharedKernel/factories/memberFactory';
import HashtagFactory from '@Domain/sharedKernel/factories/hashtag.factory';
import InvitationFactory from '@Domain/sharedKernel/factories/invitation.factory';
import PermissionFactory from '@Domain/sharedKernel/factories/permission.factory';
import TweetFactory from '@Domain/sharedKernel/factories/tweet.factory';
import UserFactory from '@Domain/sharedKernel/factories/user.factory';

const providers = [
  // SERVICES -----------------------------------
  // FACTORIES ----------------------------------
  EventFactory,
  GroupFactory,
  MemberFactory,
  HashtagFactory,
  InvitationFactory,
  PermissionFactory,
  TweetFactory,
  UserFactory,
];

@Module({
  providers: providers,
  exports: providers,
})
export default class SharedKernelBoundedContext {}
