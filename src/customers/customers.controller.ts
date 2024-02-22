import { Controller, Get, HttpCode, ParseIntPipe, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Public } from 'src/common/decorators';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('/stores')
  @HttpCode(200)
  @Public()
  getStores() {
    return this.customersService.getStores();
  }

  @Get('/stores/:storeId/items')
  @HttpCode(200)
  @Public()
  getStoreItems(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.customersService.getStoreItems(storeId);
  }

  @Get('/orders/:orderId')
  @HttpCode(200)
  @Public()
  getOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.customersService.getOrder(orderId);
  }
}
