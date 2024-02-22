import { ParseIntPipe } from '@nestjs/common';
import { Controller, HttpCode, Get, Put, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/vendors')
  @HttpCode(200)
  getVendors() {
    return this.adminService.getVendors();
  }

  @Put('/vendors/:vendorId')
  @HttpCode(200)
  approveVendor(@Param('vendorId', ParseIntPipe) vendorId: number) {
    return this.adminService.approveVendor(vendorId);
  }

  @Put('/vendors/:vendorId/pend')
  @HttpCode(200)
  pendVendor(@Param('vendorId', ParseIntPipe) vendorId: number) {
    return this.adminService.pendVendor(vendorId);
  }

  @Put('/vendors/:vendorId/stores/:storeId/restrict')
  @HttpCode(200)
  restrictStore(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
  ) {
    return this.adminService.restrictStore(vendorId, storeId);
  }

  @Put('/vendors/:vendorId/stores/:storeId/open')
  @HttpCode(200)
  openStore(
    @Param('vendorId', ParseIntPipe) vendorId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
  ) {
    return this.adminService.openStore(vendorId, storeId);
  }

  @Get('/orders')
  @HttpCode(200)
  getOrders() {
    return this.adminService.getOrders();
  }

  @Get('/customers')
  @HttpCode(200)
  getCustomers() {
    return this.adminService.getCustomers();
  }
}
