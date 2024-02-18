import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { OrderService } from 'src/interfaces/order-service';

@Controller('/order/:id')
export class GetOrderDetailsController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }
}
