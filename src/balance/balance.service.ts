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
        amount: dto.amount,
      },
    });
    return balance;
  }
}
