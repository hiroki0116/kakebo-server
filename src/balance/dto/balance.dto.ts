import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBalanceDto {
  @IsNumber()
  @IsOptional()
  amount: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  balanceType: BalanceType;
}

enum BalanceType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}
