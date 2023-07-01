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

  afterAll(async () => {
    await prisma.cleanDatabase();
  });

  describe('Add balance', () => {
    it('should add balance', async () => {
      const dto: BalanceDto = {
        amount: 100,
        title: 'test',
      };
      const balance = await balanceService.createBalance(user.id, dto);
      expect(balance.title).toBe(dto.title);
      expect(balance.amount).toBe(dto.amount);
      expect(balance.balanceType).toBe(BalanceType.INCOME);
    });

    it('should add balance with expense', async () => {
      const dto: BalanceDto = {
        amount: -100,
        title: 'test',
        balanceType: BalanceType.EXPENSE,
      };
      const balance = await balanceService.createBalance(user.id, dto);
      expect(balance.title).toBe(dto.title);
      expect(balance.amount).toBe(dto.amount);
      expect(balance.balanceType).toBe(BalanceType.EXPENSE);
    });

    it('should fail to add balance with invalid balance type', async () => {
      const dto: BalanceDto = {
        amount: 100,
        title: 'test',
        balanceType: 'INVALID' as BalanceType,
      };
      await expect(
        balanceService.createBalance(user.id, dto),
      ).rejects.toThrowError();
    });

    it('should fail to add balance with invalid amount', async () => {
      const dto: BalanceDto = {
        amount: NaN,
        title: 'test',
      };
      await expect(
        balanceService.createBalance(user.id, dto),
      ).rejects.toThrowError();
    });
  });

  describe("Get all user's balances", () => {
    const dto: BalanceDto = {
      amount: 100,
      title: 'test',
    };
    it('should get all user balances', async () => {
      await balanceService.createBalance(user.id, dto);
      const balances = await balanceService.getAllBalance(user.id);
      expect(balances.length).toBe(3);
    });

    it('should return empty array if user has no balances', async () => {
      const balances = await balanceService.getAllBalance(0);
      expect(balances.length).toBe(0);
    });

    it('should fail to get all user balances with invalid user id', async () => {
      await expect(balanceService.getAllBalance(NaN)).rejects.toThrowError();
    });
  });

  describe('Get balance by id', () => {
    const dto: BalanceDto = {
      amount: 100,
      title: 'test',
    };
    it('should fail to get balance by id with invalid user id', async () => {
      await expect(
        balanceService.getBalanceById(NaN, 1),
      ).rejects.toThrowError();
    });

    it('should get balance by id', async () => {
      const balance = await balanceService.createBalance(user.id, dto);
      expect(balance.id).toBeDefined();
      expect(balance.title).toBe(dto.title);
      expect(balance.amount).toBe(dto.amount);
    });

    it('should fail to get balance by invalid id', async () => {
      await expect(
        balanceService.getBalanceById(user.id, NaN),
      ).rejects.toThrowError();
    });

    describe('Update balance', () => {
      const dto: BalanceDto = {
        amount: 100,
        title: 'test',
      };
      it('should fail to update balance with invalid user id', async () => {
        const balance = await balanceService.createBalance(user.id, dto);
        await expect(
          balanceService.updateBalanceById(NaN, balance.id, dto),
        ).rejects.toThrowError();
      });

      it('should fail to update balance with invalid balance id', async () => {
        await expect(
          balanceService.updateBalanceById(user.id, NaN, dto),
        ).rejects.toThrowError();
      });

      it('should update balance', async () => {
        const balance = await balanceService.createBalance(user.id, dto);
        const updatedBalance = await balanceService.updateBalanceById(
          user.id,
          balance.id,
          {
            amount: 200,
            title: 'test2',
          },
        );
        expect(updatedBalance.id).toBe(balance.id);
        expect(updatedBalance.amount).toBe(200);
        expect(updatedBalance.title).toBe('test2');
      });

      describe('Delete balance', () => {
        it('should failed to delete balance with invalid user id', async () => {
          const balance = await balanceService.createBalance(user.id, dto);
          await expect(
            balanceService.deleteBalanceById(NaN, balance.id),
          ).rejects.toThrowError();
        });

        it('should failed to delete balance with invalid balance id', async () => {
          await expect(
            balanceService.deleteBalanceById(user.id, NaN),
          ).rejects.toThrowError();
        });

        it('should delete balance by id', async () => {
          const balance = await balanceService.createBalance(user.id, dto);
          await balanceService.deleteBalanceById(user.id, balance.id);
          const deletedBalance = await balanceService.getBalanceById(
            user.id,
            balance.id,
          );
          expect(deletedBalance).toBeNull();
        });
      });
    });
  });
});
