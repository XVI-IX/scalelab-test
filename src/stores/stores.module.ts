import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
  imports: [PrismaModule, ItemsModule],
})
export class StoresModule {}
