import { Req, Body, Controller, Post, Get } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/balance.dto';
import { Request } from 'express';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  createBalance(@Req() req: Request, @Body() dto: CreateBalanceDto) {
    const userId = req.user.id;
    return this.balanceService.createBalance(userId, dto);
  }

  @Get()
  getAllBalance(@Req() req: Request) {
    const userId = req.user.id;
    return this.balanceService.getAllBalance(userId);
  }
}
