import { Injectable } from '@nestjs/common';
import { OrderService } from 'src/interfaces/order-service';
import { Order, OrderDetails } from '../entities/order';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PrismaOrderService implements OrderService {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<Order> {
    return this.prisma.$transaction(async (prisma) => {
      const orderOnDatabase = await prisma.orders.create({
        data: {
          comment: order.comment,
          rate: order.rate,
        },
      });

      await Promise.all(
        order.itemsIds.map(async (id) => {
          return prisma.orderMenu.create({
            data: {
              orderId: orderOnDatabase.id,
              menuId: id,
            },
          });
        }),
      );

      return {
        id: orderOnDatabase.id,
        ...order,
      };
    });
  }

  async findOne(id: string): Promise<OrderDetails> {
    return this.prisma.orders.findUnique({
      where: {
        id,
      },
      include: {
        menuItems: {
          include: {
            menu: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.orderMenu.deleteMany({
      where: {
        orderId: id,
      },
    });

    await this.prisma.orders.delete({
      where: {
        id,
      },
    });
  }
}
