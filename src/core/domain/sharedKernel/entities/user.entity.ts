import Tweet from './tweet.entity';
import Member from './member.entity';

export default class User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  mobileNumber: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  tweets: Tweet[];
  memberships: Member[];
}
