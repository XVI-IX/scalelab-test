import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto';
import { UserEntity } from 'src/common/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ItemsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async addItemToStore(user: UserEntity, store_id: number, dto: CreateItemDto) {
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

      const sseData = {
        action: 'Vendor adding items',
        vendor_id: user.sub,
        vendor_username: user.username,
      };

      this.eventEmitter.emit('vendor.action', { data: sseData });

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

  async updateItem(
    user: UserEntity,
    store_id: number,
    item_id: number,
    dto: UpdateItemDto,
  ) {
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

      const sseData = {
        action: 'Vendor updating store item',
        vendor_id: user.sub,
        vendor_username: user.username,
        store_id: store_id,
      };

      this.eventEmitter.emit('vendor.action', { data: sseData });

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

  async changeAvailability(
    user: UserEntity,
    store_id: number,
    item_id: number,
  ) {
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

      const sseData = {
        action: 'Vendor changed item availability',
        vendor_id: user.sub,
        vendor_username: user.username,
        item_id: item_id,
      };

      this.eventEmitter.emit('vendor.action', { data: sseData });

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

  async deleteItem(user: UserEntity, store_id: number, item_id: number) {
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

      const sseData = {
        action: 'Vendor deleted items',
        vendor_id: user.sub,
        vendor_username: user.username,
        store_id,
      };

      this.eventEmitter.emit('vendor.action', { data: sseData });

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
