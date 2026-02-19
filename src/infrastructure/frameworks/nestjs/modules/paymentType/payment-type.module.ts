import { Module } from '@nestjs/common';
import { PaymentTypeController } from './controllers/paymentType.controller';

@Module({
  controllers: [PaymentTypeController],
})
export class PaymentTypeModule {}
