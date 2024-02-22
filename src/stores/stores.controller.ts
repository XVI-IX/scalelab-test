import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  ParseIntPipe,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { Public, User } from 'src/common/decorators';
import { UserEntity } from 'src/common/entities/user.entity';
import { CreateStoreDto } from './dto';
import { updateStoreDto } from './dto/updateStore.dto';
import { ItemsService } from 'src/items/items.service';
import { CreateItemDto, UpdateItemDto } from 'src/items/dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, map, fromEvent } from 'rxjs';

@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private eventEmitter: EventEmitter2,
    private readonly itemService: ItemsService,
  ) {}

  @Sse('/sse')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'vendor.action').pipe(
      map((payload) => {
        return { data: JSON.stringify(payload) };
      }),
    );
  }

  @Post()
  @Roles(Role.Vendor)
  async createStore(@User() user: UserEntity, @Body() dto: CreateStoreDto) {
    return this.storesService.createStore(user, dto);
  }

  @Get()
  @Roles(Role.Vendor)
  async getStores(@User() user: UserEntity) {
    return this.storesService.getStores(user);
  }

  @Get('/:storeId')
  @HttpCode(200)
  async getStoreById(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.storesService.getStoreById(storeId);
  }

  @Put('/:storeId')
  @Roles(Role.Vendor)
  async updateStoreById(
    @User() user: UserEntity,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() dto: updateStoreDto,
  ) {
    return this.storesService.updateStoreById(user, storeId, dto);
  }

  @Put('/:storeId/changeStatus')
  @Roles(Role.Vendor)
  async changeStoreStatus(
    @User() user: UserEntity,
    @Param('storeId', ParseIntPipe) storeId: number,
  ) {
    return this.storesService.changeStoreStatus(user, storeId);
  }

  @Get('/:storeId/items')
  @Public()
  async getStoreItems(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.storesService.getStoreItems(storeId);
  }

  @Post('/:storeId/items')
  @Roles(Role.Vendor)
  async addItemToStore(
    @User() user: UserEntity,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() dto: CreateItemDto,
  ) {
    return this.itemService.addItemToStore(user, storeId, dto);
  }

  @Put('/:storeId/items/:itemId')
  @Roles(Role.Vendor)
  async updateItem(
    @User() user: UserEntity,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.itemService.updateItem(user, storeId, itemId, dto);
  }

  @Put('/:storeId/items/:itemId/available')
  @Roles(Role.Vendor)
  async changeAvailability(
    @User() user: UserEntity,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.itemService.changeAvailability(user, storeId, itemId);
  }

  @Delete('/:storeId/items/:itemId')
  @Roles(Role.Vendor)
  async deleteItem(
    @User() user: UserEntity,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.itemService.deleteItem(user, storeId, itemId);
  }

  @Delete('/:storeId')
  @Roles(Role.Vendor)
  async deleteStore(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.storesService.deleteStore(storeId);
  }
}
