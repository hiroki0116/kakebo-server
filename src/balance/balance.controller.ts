import {
  Req,
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceDto } from './dto/balance.dto';
import { Request } from 'express';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  createBalance(@Req() req: Request, @Body() dto: BalanceDto) {
    const userId = req.user.id;
    return this.balanceService.createBalance(userId, dto);
  }

  @Get()
  getAllBalance(@Req() req: Request) {
    const userId = req.user.id;
    return this.balanceService.getAllBalance(userId);
  }

  @Get(':id')
  getBalanceById(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.balanceService.getBalanceById(userId, id);
  }

  @Patch(':id')
  updateBalanceById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BalanceDto,
  ) {
    const userId = req.user.id;
    return this.balanceService.updateBalanceById(userId, id, dto);
  }
}
