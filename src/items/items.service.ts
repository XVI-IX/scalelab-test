import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async addItemToStore(store_id: number, dto: CreateItemDto) {
    try {
      const item = await this.prisma.items.create({
        data: {
          store: {
            connect: {
              store_id: store_id,
            },
          },
          name: dto.name,
          description: dto.description,
          image_url: dto.image_url,
          price: dto.price,
        },
      });

      if (!item) {
        throw new InternalServerErrorException(
          'item could not be added to store',
        );
      }

      return {
        message: 'Item added to store successfully',
        status: 'success',
        statusCode: 200,
        data: item,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateItem(store_id: number, item_id: number, dto: UpdateItemDto) {
    try {
      const item = await this.prisma.items.update({
        where: {
          store_id: store_id,
          item_id: item_id,
        },
        data: dto,
      });

      if (!item) {
        throw new InternalServerErrorException('Item could not be updated');
      }
      return {
        message: 'Item updated successfully.',
        status: 'success',
        statusCode: 200,
        data: item,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async changeAvailability(store_id: number, item_id: number) {
    try {
      const item = await this.prisma.items.findUnique({
        where: {
          item_id: item_id,
          store_id: store_id,
        },
      });

      if (!item) {
        throw new NotFoundException('Item could not be found');
      }

      await this.prisma.items.update({
        where: {
          item_id: item_id,
        },
        data: {
          available: !item.available,
        },
      });

      return {
        message: 'Item availability updated',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteItem(store_id: number, item_id: number) {
    try {
      const item = await this.prisma.items.delete({
        where: {
          item_id: item_id,
          store_id: store_id,
        },
      });

      if (!item) {
        throw new InternalServerErrorException('Item could not be deleted');
      }

      return {
        message: 'Item deleted successfully',
        status: 'success',
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
