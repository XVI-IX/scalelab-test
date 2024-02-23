import {
  Controller,
  Sse,
  MessageEvent,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Get,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import { Public, User } from 'src/common/decorators';
import { PaymentsService } from 'src/payments/payments.service';
import { UserEntity } from 'src/common/entities/user.entity';
import { OrderDto } from './dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private eventEmitter: EventEmitter2,
    private payment: PaymentsService,
  ) {}

  @Sse('/sse')
  sse(): Observable<MessageEvent> {
    console.log('send to frontend');
    return fromEvent(this.eventEmitter, 'new.order').pipe(
      map((payload) => {
        return { data: JSON.stringify(payload) };
      }),
    );
  }

  @Sse('/sse-valid')
  SseValidOrder(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'valid.order').pipe(
      map((payload) => {
        return { data: JSON.stringify(payload) };
      }),
    );
  }

  @Post('/:storeId')
  @Public()
  async createOrder(
    @User() user: UserEntity,
    @Body() dto: OrderDto,
    @Param('storeId', ParseIntPipe) storeId: number,
  ) {
    return this.ordersService.order(user.sub, dto, storeId);
  }

  @Get('/verify/:orderId')
  @Roles(Role.Admin)
  async verifyOrder(
    @Body('reference') reference: string,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.verifyOrder(reference, orderId);
  }
}
