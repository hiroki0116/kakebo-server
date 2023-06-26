import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BalanceDto } from './dto/balance.dto';
import { Balance } from '@prisma/client';

@Injectable()
export class BalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async createBalance(userId: number, dto: BalanceDto): Promise<Balance> {
    const balance = await this.prisma.balance.create({
      data: {
        userId,
        ...dto,
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

  async getBalanceById(userId: number, id: number): Promise<Balance> {
    const balance = await this.prisma.balance.findFirst({
      where: { id, userId },
    });
    return balance;
  }

  async updateBalanceById(
    userId: number,
    id: number,
    dto: BalanceDto,
  ): Promise<Balance> {
    const balance = await this.prisma.balance.findUnique({
      where: { id },
    });
    if (!balance || balance.userId !== userId) {
      throw new Error('Unauthorized');
    }

    return this.prisma.balance.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async deleteBalanceById(userId: number, id: number): Promise<void> {
    const balance = await this.prisma.balance.findUnique({
      where: { id },
    });
    if (!balance || balance.userId !== userId) {
      throw new Error('Unauthorized');
    }

    this.prisma.balance.delete({
      where: { id },
    });
  }
}
