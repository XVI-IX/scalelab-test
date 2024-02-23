import { Module } from '@nestjs/common';
import { TimeslotsService } from './timeslots.service';
import { TimeslotsController } from './timeslots.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TimeslotsController],
  providers: [TimeslotsService],
  imports: [PrismaModule]
})
export class TimeslotsModule {}
