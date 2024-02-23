import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { User } from 'src/common/decorators';
import { UserEntity } from 'src/common/entities/user.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { UpdateVendorDto } from './dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  getVendor(@User() user: UserEntity) {
    return this.vendorsService.getVendor(user);
  }

  @Put()
  @HttpCode(200)
  async updateVendor(@User() user: UserEntity, @Body() dto: UpdateVendorDto) {
    return this.vendorsService.updateVendor(user, dto);
  }
}
