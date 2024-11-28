import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get('/liveness')
  @HealthCheck()
  async checkHTTP() {
    // const checkHTTP = await this.health.check([
    //   () => this.http.pingCheck('google', 'https://googlejfsdf.com'),
    // ]);
    return {
      message: 'ok',
      // data: checkHTTP,
    };
  }

  @Get('/readiness')
  @HealthCheck()
  async checkDB() {
    const checkTypeorm = await this.health.check([
      async () => this.db.pingCheck('typeorm'),
    ]);
    return {
      message: 'readiness',
      data: checkTypeorm,
    };
  }
}
