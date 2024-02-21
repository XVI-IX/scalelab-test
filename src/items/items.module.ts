import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  imports: [PrismaModule],
  exports: [ItemsService],
})
export class ItemsModule {}
