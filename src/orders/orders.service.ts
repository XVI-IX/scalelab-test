import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto, order_items } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async order(customerId: number, dto: OrderDto, storeId: number) {
    try {
      const orderData = {
        customer: { connect: { user_id: customerId}},
        store: { connect: { store_id: storeId}},
        timeslot: { connect: { timeslot_id: }},
        total_price: dto.total_price,
        order_items: dto.order_items.map((item) => ({
          items: { connect: {item_id: item.itemId}},
          quantity: item.quantity,
          price: item.price
        }))
      }
      const order = await this.prisma.orders.create({
        data: orderData
      });

      if (!order) {
        throw new InternalServerErrorException("Order could not be placed")
      }

      return order
    } catch (error) {}
  }
}
