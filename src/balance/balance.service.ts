import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBalanceDto } from './dto/balance.dto';
import { Balance } from '@prisma/client';

@Injectable()
export class BalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createBalance(userId: number, dto: CreateBalanceDto): Promise<Balance> {
    const balance = await this.prisma.balance.create({
      data: {
        userId,
        title: dto.title,
        amount: dto.amount,
        balnaceType: dto.balanceType,
      },
    });
    return balance;
  }

  async getAllBalance(userId: number): Promise<Balance[]> {
    const balances = await this.prisma.balance.findMany({
      where: { userId },
    });
    return balances;
  }
}
