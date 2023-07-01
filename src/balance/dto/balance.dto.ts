import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BalanceDto {
  @IsNumber()
  @IsOptional()
  amount: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  balanceType?: 'INCOME' | 'EXPENSE';
}
