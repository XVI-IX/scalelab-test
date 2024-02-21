import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { vendor } from 'src/vendors/vendor.entity';
import { updateStoreDto } from './dto/updateStore.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async createStore(vendorData: vendor, dto: CreateStoreDto) {
    try {
      const store = await this.prisma.stores.create({
        data: {
          vendor: {
            connect: {
              vendor_id: vendorData.vendor_id,
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

  async getStores(vendorData: vendor) {
    try {
      const stores = await this.prisma.stores.findMany({
        where: {
          vendor_id: vendorData.vendor_id,
        },
        select: {
          store_id: true,
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

  async getStoreById(vendorData: vendor, store_id: number) {
    try {
      const store = await this.prisma.stores.findFirst({
        where: {
          store_id: store_id,
          vendor_id: vendorData.vendor_id,
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
    vendorData: vendor,
    store_id: number,
    dto: updateStoreDto,
  ) {
    try {
      const store = await this.prisma.stores.update({
        where: {
          vendor_id: vendorData.vendor_id,
          store_id: store_id,
        },
        data: dto,
      });

      if (!store) {
        throw new InternalServerErrorException('Store could not be updated');
      }

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

  async changeStoreStatus(vendorData: vendor, store_id: number) {
    try {
      const store = await this.prisma.stores.findUnique({
        where: {
          vendor_id: vendorData.vendor_id,
          store_id: store_id,
        },
      });

      if (store) {
        await this.prisma.stores.update({
          where: {
            store_id: store.store_id,
          },
          data: {
            active: !store.active,
          },
        });

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

  async deleteStore(store_id: number) {
    try {
      const store = await this.prisma.stores.delete({
        where: {
          store_id: store_id,
        },
      });

      if (!store) {
        throw new InternalServerErrorException('Store could not be deleted');
      }

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
