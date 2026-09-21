import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { calculateTaxRateEngine } from './fixtures/duplication/taxRateEngine';
import { executeTaxWorkflow } from './fixtures/complexity/taxWorkflow';

@Controller()
export class BillingMicroserviceController {
  @MessagePattern({ cmd: 'compute_tax' })
  computeTax(data: { amount: number; state: string; isExempt: boolean }) {
    return calculateTaxRateEngine(data.amount, data.state, data.isExempt);
  }

  @MessagePattern({ cmd: 'evaluate_workflow' })
  evaluateWorkflow(data: { tier: string; volume: number; isCrossBorder: boolean; hasSpecialCert: boolean }) {
    return executeTaxWorkflow(data.tier, data.volume, data.isCrossBorder, data.hasSpecialCert);
  }
}

@Module({
  controllers: [BillingMicroserviceController]
})
export class BillingModule {}

export async function bootstrapBilling() {
  const app = await NestFactory.createMicroservice(BillingModule, {
    transport: Transport.TCP,
    options: { port: 8875 }
  });
  return app;
}
