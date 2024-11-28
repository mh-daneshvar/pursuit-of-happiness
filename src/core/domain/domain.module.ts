import { Module } from '@nestjs/common';
import SharedKernelBoundedContext from '@Domain/sharedKernel/sharedKernel.boundedContext';
import AuthorsBoundedContext from '@Domain/authors/authors.boundedContext';

@Module({
  imports: [SharedKernelBoundedContext, AuthorsBoundedContext],
  exports: [SharedKernelBoundedContext, AuthorsBoundedContext],
})
export default class DomainModule {}
