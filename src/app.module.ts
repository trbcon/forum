import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { InfraModule } from './infra/infra.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    // AuthModule,
    ApiModule,
    PrismaModule, 
    InfraModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }), NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
