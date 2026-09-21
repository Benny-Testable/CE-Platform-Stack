import { NextResponse } from 'next/server';
import { calculateInvoiceA } from '@/fixtures/duplication/invoiceProcessorA';
import { executeSubscriptionUpgrade } from '@/fixtures/complexity/subscriptionWorkflow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const invoice = calculateInvoiceA(body.items || [], body.taxRate || 0.1, body.coupon || '');
    const workflow = executeSubscriptionUpgrade(body.plan || 'BASIC', body.months || 1, false, false);
    
    return NextResponse.json({
      status: 'SUCCESS',
      invoice,
      workflow
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'ERROR', message: err.message }, { status: 400 });
  }
}
