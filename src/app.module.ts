import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BalanceModule } from './balance/balance.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, BalanceModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
