import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateStoreDto } from './dto/updateStore.dto';
import { UserEntity } from 'src/common/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StoresService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createStore(user: UserEntity, dto: CreateStoreDto) {
    try {
      const vendor = await this.prisma.vendors.findUnique({
        where: {
          id: user.sub,
        },
      });

      if (vendor.status !== 'approved') {
        throw new UnauthorizedException(
          'Your vendor account must be approved to create a store',
        );
      }

      const store = await this.prisma.stores.create({
        data: {
          vendor: {
            connect: {
              id: user.sub,
            },
          },
          name: dto.name,
          description: dto.description,
          address: dto.address,
          image_url: dto.image_url,
        },
      });

      if (!store) {
        throw new InternalServerErrorException('Store could not be created');
      }

      return {
        message: 'Store has been created',
        status: 'success',
        statusCode: 200,
        data: store,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getStores(user: UserEntity) {
    try {
      const stores = await this.prisma.stores.findMany({
        where: {
          vendor_id: user.sub,
        },
        select: {
          id: true,
          vendor_id: true,
          name: true,
          address: true,
          description: true,
          image_url: true,
        },
      });

      if (!stores) {
        throw new InternalServerErrorException(
          'your stores could not be retrieved',
        );
      }

      if (stores.length === 0) {
        throw new NotFoundException('No stores found.');
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

  async getStoreById(store_id: number) {
    try {
      const store = await this.prisma.stores.findFirst({
        where: {
          id: store_id,
        },
      });

      if (!store) {
        throw new NotFoundException('Store not found');
      }

      return {
        message: 'Store retrieved',
        status: 'success',
        statusCode: 200,
        data: store,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateStoreById(
    user: UserEntity,
    store_id: number,
    dto: updateStoreDto,
  ) {
    try {
      const vendor = await this.prisma.vendors.findUnique({
        where: {
          id: user.sub,
        },
      });

      if (vendor.status !== 'approved') {
        throw new UnauthorizedException(
          'Your vendor account must be approved to update a store',
        );
      }

      const store = await this.prisma.stores.update({
        where: {
          id: store_id,
          status: 'approved',
          admin_open: true,
        },
        data: dto,
      });

      if (!store) {
        throw new InternalServerErrorException('Store could not be updated');
      }

      const sseData = {
        action: 'Vendor updating store',
        vendor_id: user.sub,
        vendor_username: user.username,
      };

      this.eventEmitter.emit('vendor.action', { data: sseData });

      return {
        message: 'Store updated',
        status: 'success',
        statusCode: 200,
        data: store,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async changeStoreStatus(user: UserEntity, store_id: number) {
    try {
      const vendor = await this.prisma.vendors.findUnique({
        where: {
          id: user.sub,
        },
      });

      if (vendor.status !== 'approved') {
        throw new UnauthorizedException(
          'Your vendor account must be approved to change your store visibility',
        );
      }

      const store = await this.prisma.stores.findUnique({
        where: {
          vendor_id: user.sub,
          id: store_id,
          status: 'approved',
          admin_open: true,
        },
      });

      if (store) {
        await this.prisma.stores.update({
          where: {
            id: store.id,
          },
          data: {
            active: !store.active,
          },
        });

        const sseData = {
          action: "Vendor changing store's status",
          vendor_id: user.sub,
          vendor_username: user.username,
        };

        this.eventEmitter.emit('vendor.action', { data: sseData });

        return {
          message: 'Store visiblilty updated',
          status: 'success',
          statusCode: 200,
        };
      }

      throw new NotFoundException('Store not found');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getStoreItems(store_id: number) {
    try {
      const items = await this.prisma.stores.findUnique({
        where: {
          id: store_id,
        },
        select: {
          items: true,
        },
      });

      if (!items) {
        throw new NotFoundException('Items not found');
      }

      return {
        message: 'Items retrieved',
        status: 'success',
        statusCode: 200,
        data: items.items,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteStore(user: UserEntity, store_id: number) {
    try {
      const vendor = await this.prisma.vendors.findUnique({
        where: {
          id: user.sub,
        },
      });

      if (vendor.status !== 'approved') {
        throw new UnauthorizedException(
          'Your vendor account must be approved to delete a store',
        );
      }

      const store = await this.prisma.stores.delete({
        where: {
          id: store_id,
          admin_open: true,
        },
      });

      if (!store) {
        throw new InternalServerErrorException('Store could not be deleted');
      }

      const sseData = {
        action: 'Vendor deleting store',
        vendor_id: user.sub,
        vendor_username: user.username,
      };

      this.eventEmitter.emit('vendor.action', { data: sseData });

      return {
        message: 'Store deleted successfully',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
