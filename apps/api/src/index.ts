import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';

@Controller('health')
export class ApiHealthController {
  @Get()
  checkHealth() {
    return { service: 'nestjs-api', status: 'ONLINE', repo: 'turborepo' };
  }
}

@Module({
  controllers: [ApiHealthController]
})
export class AppModule {}

export async function bootstrapApi() {
  const app = await NestFactory.create(AppModule);
  return app;
}
