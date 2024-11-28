import { Module } from '@nestjs/common';
import MetricsModule from '@PrimaryAdapters/rest/metrics/metrics.module';
import HealthModule from '@PrimaryAdapters/rest/health/health.module';
import AuthorsModule from '@PrimaryAdapters/rest/authors/authors.module';
import ProfileModule from '@PrimaryAdapters/rest/profile/profile.module';
import PublicModule from '@PrimaryAdapters/rest/public/public.module';

@Module({
  imports: [
    MetricsModule,
    HealthModule,
    AuthorsModule,
    ProfileModule,
    PublicModule,
  ],
  exports: [],
})
export default class RestPrimaryModule {}
