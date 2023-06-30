import { Test } from '@nestjs/testing';
import { BalanceType, User } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { BalanceService } from 'src/balance/balance.service';
import { BalanceDto } from 'src/balance/dto/balance.dto';
import { PrismaService } from 'src/prisma/prisma.service';

describe('BalanceService integration', () => {
  let prisma: PrismaService;
  let balanceService: BalanceService;
  let user: User;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    balanceService = moduleRef.get<BalanceService>(BalanceService);
    await prisma.cleanDatabase();
    user = await prisma.user.create({
      data: {
        email: 'test@gmail.com',
        firebaseUid: '123',
      },
    });
  });

  describe('Add balance', () => {
    const dto: BalanceDto = {
      amount: 100,
      title: 'test',
    };
    it('should add balance', async () => {
      const balance = await balanceService.createBalance(user.id, dto);
      expect(balance.title).toBe(dto.title);
      expect(balance.amount).toBe(dto.amount);
      expect(balance.balanceType).toBe(BalanceType.INCOME);
    });
  });
});
