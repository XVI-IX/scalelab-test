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
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from './email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/role.guard';
import { AdminModule } from './admin/admin.module';

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
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailModule,
    EventEmitterModule.forRoot(),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
