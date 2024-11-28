import { Module } from '@nestjs/common';
import MyOwnGroupDomainService from '@Domain/authors/services/myOwnGroup.domainService';

const providers = [
  // SERVICES -----------------------------------
  MyOwnGroupDomainService,
  // FACTORIES ----------------------------------
];

@Module({
  providers: providers,
  exports: providers,
})
export default class AuthorsBoundedContext {}
