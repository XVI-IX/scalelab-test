import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async getStores() {
    try {
      const stores = await this.prisma.stores.findMany({
        where: {
          status: 'approved',
          admin_open: true,
        },
        select: {
          id: true,
          name: true,
          address: true,
          image_url: true,
          description: true,
        },
      });

      if (!stores) {
        throw new InternalServerErrorException('Stores could not be retrieved');
      }

      return {
        message: 'Stores retrieved',
        status: 'success',
        statusCode: 200,
        data: stores,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getStoreItems(storeId: number) {
    try {
      const items = await this.prisma.items.findMany({
        where: {
          store_id: storeId,
        },
      });

      if (!items) {
        throw new InternalServerErrorException(
          'Store items could not be retrieved',
        );
      }

      return {
        message: 'Store items retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: items,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOrder(orderId: number) {
    try {
      const order = await this.prisma.orders.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        throw new InternalServerErrorException('Order could not be retrieved');
      }

      return {
        message: 'Order Retrieved successfully',
        status: 'success',
        statusCode: 200,
        data: order,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
