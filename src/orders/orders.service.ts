import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './dto';
import { PaymentsService } from 'src/payments/payments.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailData } from 'src/email/email.entity';
import config from 'src/payments/config';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private payment: PaymentsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async order(customerId: number, dto: OrderDto, storeId: number) {
    try {
      console.log(dto.timeslotId);
      const order = await this.prisma.orders.create({
        data: {
          customer: { connect: { user_id: customerId } },
          store: { connect: { store_id: storeId } },
          timeslot: { connect: { timeslot_id: Number(dto.timeslotId) } },
          total_price: dto.total_price,
          order_items: {
            createMany: {
              data: dto.order_items,
            },
          },
          delivery_location: dto.delivery_location,
        },
      });

      const customer = await this.prisma.users.findUnique({
        where: {
          user_id: customerId,
        },
      });

      if (!order) {
        throw new InternalServerErrorException('Order could not be placed');
      }

      const response = await this.payment.intializePayment(
        dto.total_price,
        customer.email,
      );

      await this.prisma.payments.create({
        data: {
          reference: response.reference,
          status: 'pending',
          order_id: order.order_id,
        },
      });

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async verifyOrder(reference: string, order_id: number) {
    try {
      const response = await this.payment.verifyPayment(reference);

      if (response.status === 'abandoned' || response.status === 'failed') {
        await this.prisma.payments.update({
          where: {
            reference: reference,
          },
          data: {
            status: 'abandoned',
          },
        });

        const order = await this.prisma.orders.update({
          where: {
            order_id: order_id,
          },
          data: {
            status: 'canceled',
          },
          include: {
            customer: true,
          },
        });

        const data: EmailData = {
          to: order.customer.email,
          data: {
            username: order.customer.user_name,
          },
        };

        this.eventEmitter.emit('order.canceled', data);

        return {
          message: 'Order canceled',
          status: 'success',
          statusCode: 200,
        };
      } else if (response.status === 'success') {
        await this.prisma.payments.update({
          where: {
            reference: reference,
          },
          data: {
            status: 'success',
          },
        });

        const order = await this.prisma.orders.update({
          where: {
            order_id: order_id,
          },
          data: {
            status: 'confirmed',
          },
          include: {
            customer: true,
            store: {
              include: {
                vendor: true,
              },
            },
          },
        });

        const amount = Number(order.total_price) - config.TRANSACTION_FEE;

        const transferReference = await this.payment.generateTransferReference(
          String(amount),
          order.store.vendor.recipient_code,
        );
        const transfer = await this.payment.initiateTransfer(transferReference);

        if (!transfer) {
          throw new InternalServerErrorException();
        }

        console.log('Transfer to user ', transfer);

        const data: EmailData = {
          to: order.customer.email,
          data: {
            username: order.customer.user_name,
          },
        };

        const sseData = {
          data: order,
        };
        this.eventEmitter.emit('order.confirmed', data);
        this.eventEmitter.emit('valid.order', sseData);

        return {
          message: 'Order successful',
          status: 'success',
          statusCode: 200,
        };
      }

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
