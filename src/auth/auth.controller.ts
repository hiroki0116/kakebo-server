import { Body, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signup')
  signup(@Body() dto: AuthDto): Promise<Msg> {
    return this.authService.signup(dto);
  }
}
