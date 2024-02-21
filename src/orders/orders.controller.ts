import { Controller, Sse, MessageEvent, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import { Public } from 'src/common/decorators';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Public()
  @Sse('/sse')
  sse(): Observable<MessageEvent> {
    console.log('send to frontend');
    return fromEvent(this.eventEmitter, 'new.order').pipe(
      map((payload) => {
        return { data: JSON.stringify(payload) };
      }),
    );
  }

  @Post()
  @Public()
  createOrder() {
    this.eventEmitter.emit('new.order', { data: 'payload' });
    return true;
  }
}
