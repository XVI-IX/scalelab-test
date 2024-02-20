import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';
import { ItemsModule } from './items/items.module';
import { TimeslotsModule } from './timeslots/timeslots.module';
import { StoresModule } from './stores/stores.module';
import { VendorsModule } from './vendors/vendors.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    OrdersModule,
    ItemsModule,
    TimeslotsModule,
    StoresModule,
    VendorsModule,
    PaymentsModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
