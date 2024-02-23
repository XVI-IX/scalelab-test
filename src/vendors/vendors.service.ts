import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateVendorDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/common/entities/user.entity';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async getVendor(vendor: UserEntity) {
    try {
      const data = await this.prisma.vendors.findUnique({
        where: {
          id: vendor.sub,
        },
        select: {
          id: true,
          name: true,
          phone_number: true,
          business_address: true,
          status: true,
          stores: true,
          orders: true,
        },
      });

      if (!data) {
        throw new InternalServerErrorException(
          'Vendor data could not be retrieved',
        );
      }

      return {
        message: 'Vendor data retrieved successfully',
        status: 'success',
        statusCode: 200,
        data,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateVendor(data: UserEntity, dto: UpdateVendorDto) {
    try {
      const vendor = await this.prisma.vendors.update({
        where: {
          id: data.sub,
          status: 'approved',
        },
        data: dto,
      });

      if (!vendor) {
        throw new InternalServerErrorException('Vendor could not be updated');
      }

      return {
        message: 'Vendor updated.',
        status: 'success',
        statusCode: 200,
        data: vendor,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
