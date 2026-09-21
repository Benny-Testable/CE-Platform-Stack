import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { calculateTaxNotificationEngine } from './fixtures/duplication/taxNotificationEngine';
import { dispatchAlertEvents } from './fixtures/complexity/alertDispatcher';

@Controller()
export class NotificationMicroserviceController {
  @MessagePattern({ cmd: 'preview_tax_alert' })
  previewTaxAlert(data: { amount: number; jurisdiction: string; exempt: boolean }) {
    return calculateTaxNotificationEngine(data.amount, data.jurisdiction, data.exempt);
  }

  @MessagePattern({ cmd: 'send_bulk_alerts' })
  sendBulkAlerts(data: { alerts: any[] }) {
    return dispatchAlertEvents(data.alerts);
  }
}

@Module({
  controllers: [NotificationMicroserviceController]
})
export class NotificationModule {}

export async function bootstrapNotifications() {
  const app = await NestFactory.createMicroservice(NotificationModule, {
    transport: Transport.TCP,
    options: { port: 8876 }
  });
  return app;
}
