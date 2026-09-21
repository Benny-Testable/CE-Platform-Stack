import path from 'path';
import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { validatePaymentPayload } from './fixtures/duplication/paymentValidator';
import { routePaymentTransaction } from './fixtures/complexity/paymentRouter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, '../../../proto/payment.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const paymentProto: any = grpc.loadPackageDefinition(packageDefinition).payment;

function processPayment(call: any, callback: any) {
  const req = call.request;
  const validation = validatePaymentPayload({
    orderId: req.order_id,
    amount: req.amount,
    currency: req.currency
  });

  if (!validation.valid) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: validation.reasons.join(', ')
    });
  }

  const routerResult = routePaymentTransaction([
    { provider: 'STRIPE', attempts: 1, amount: req.amount }
  ]);

  callback(null, {
    transaction_id: 'TXN-' + Math.floor(Math.random() * 1000000),
    status: routerResult.success ? 'APPROVED' : 'DECLINED',
    authorization_code: 'AUTH-2026-OK'
  });
}

export function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(paymentProto.PaymentService.service, {
    ProcessPayment: processPayment,
    QueryTransaction: (call: any, callback: any) => {
      callback(null, { transaction_id: call.request.transaction_id, status: 'VERIFIED' });
    }
  });

  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind gRPC server:', err);
      return;
    }
    console.log(`Payment gRPC Server running on port ${port}`);
  });
}
