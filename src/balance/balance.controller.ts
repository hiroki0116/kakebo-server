import { Req, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/balance.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  createBalance(@Req() req: Request, @Body() dto: CreateBalanceDto) {
    const userId = req.user.id;
    return this.balanceService.createBalance(userId, dto);
  }
}
