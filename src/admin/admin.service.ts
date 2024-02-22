import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Injectable,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('admin.getVendors')
  @CacheTTL(30)
  async getVendors() {
    try {
      const vendors = await this.prisma.vendors.findMany();
      if (!vendors) {
        throw new InternalServerErrorException(
          'Vendors could not be retrieved',
        );
      }

      return {
        message: 'vendors retrieved',
        status: 'success',
        statusCode: 200,
        data: vendors,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async approveVendor(vendorId: number) {
    try {
      const vendor = await this.prisma.vendors.update({
        where: {
          vendor_id: vendorId,
        },
        data: {
          status: 'approved',
        },
      });

      if (!vendor) {
        throw new InternalServerErrorException('Vendor could not verified');
      }

      return {
        message: `Vendor - ${vendor.name} approved`,
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async pendVendor(vendorId: number) {
    try {
      const vendor = await this.prisma.vendors.update({
        where: {
          vendor_id: vendorId,
        },
        data: {
          status: 'pending',
        },
      });

      if (!vendor) {
        throw new InternalServerErrorException('Vendor could not be pended');
      }

      return {
        message: `Vendor - ${vendor.name} pended`,
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async restrictStore(vendorId: number, storeId: number) {
    try {
      const store = await this.prisma.stores.update({
        where: {
          store_id: storeId,
          vendor_id: vendorId,
        },
        data: {
          admin_open: false,
        },
      });

      if (!store) {
        throw new InternalServerErrorException('Store could not be closed');
      }

      return {
        message: 'store closed.',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async openStore(vendorId: number, storeId: number) {
    try {
      const store = await this.prisma.stores.update({
        where: {
          store_id: storeId,
          vendor_id: vendorId,
        },
        data: {
          admin_open: true,
        },
      });

      if (!store) {
        throw new InternalServerErrorException('Store could not be open');
      }

      return {
        message: 'store Open.',
        status: 'success',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('admin.getOrders')
  @CacheTTL(30)
  async getOrders() {
    try {
      const orders = await this.prisma.orders.findMany();

      if (!orders) {
        throw new InternalServerErrorException('Orders could not be retrieved');
      }

      return {
        message: 'Orders retrieved',
        status: 'success',
        statusCode: 200,
        data: orders,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @UseInterceptors(CacheInterceptor)
  @CacheKey('admin.getCustomers')
  @CacheTTL(30)
  async getCustomers() {
    try {
      const customers = await this.prisma.users.findMany({
        where: {
          role: 'customer',
        },
      });

      if (!customers) {
        throw new InternalServerErrorException(
          'Customers could not be retrieved',
        );
      }

      return {
        message: 'Customers Retrieved',
        status: 'success',
        statusCode: 200,
        data: customers,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async sendMessage() {}
}
