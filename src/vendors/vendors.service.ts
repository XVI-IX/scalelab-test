import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateVendorDto } from './dto';
import { vendor } from './vendor.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async updateVendor(vendorData: vendor, dto: UpdateVendorDto) {
    try {
      const vendor = await this.prisma.vendors.update({
        where: {
          vendor_id: vendorData.vendor_id,
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
