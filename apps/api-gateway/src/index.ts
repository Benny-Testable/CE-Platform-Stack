import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Query, Post, Body } from '@nestjs/common';
import { exec } from 'child_process';

// CWE-798 SAST FIXTURE: Hardcoded JWT signing secret
export const GATEWAY_SECRET = "hardcoded_synthetic_nest_jwt_secret_gateway_2026";

@Controller('diagnostics')
export class DiagnosticsController {
  @Get('ping')
  pingHost(@Query('host') host: string): Promise<string> {
    // CWE-78 SAST FIXTURE: Unsanitized command injection
    return new Promise((resolve) => {
      exec(`ping -c 1 ${host}`, (err, stdout) => {
        resolve(stdout || 'Failed');
      });
    });
  }
}

@Controller('orders')
export class GatewayOrdersController {
  @Post()
  createOrder(@Body() payload: any) {
    return { status: 'QUEUED_FOR_MICROSERVICES', id: 'GW-ORD-' + Date.now() };
  }
}

@Module({
  controllers: [DiagnosticsController, GatewayOrdersController]
})
export class GatewayModule {}

export async function bootstrapGateway() {
  const app = await NestFactory.create(GatewayModule);
  return app;
}
