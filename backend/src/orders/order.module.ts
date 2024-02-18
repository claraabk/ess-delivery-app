import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CreateOrderController } from './controllers/create-order.controller';
import { GetOrderDetailsController } from './controllers/get-order-details.controller';
import { DeleteOrderController } from './controllers/delete-order.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateOrderController,
    GetOrderDetailsController,
    DeleteOrderController,
  ],
})
export class OrderModule {}
