import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login.dto';
import { RegisterRequest } from './dto/register.dto';
import type { Request, Response } from 'express';
import { Authorization } from 'src/common/decorators/authorization.decorator';
import { Authorizated } from 'src/common/decorators/authorizated.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login( @Res({passthrough: true}) res: Response, @Body() dto: LoginRequest) {
    return await this.authService.login( res, dto );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register( @Res({passthrough: true}) res: Response, @Body() dto: RegisterRequest ) {
    return await this.authService.register(res, dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh( @Req() req: Request, @Res({passthrough: true}) res: Response ) {
    return await this.authService.refresh( req, res );
  }

  @Delete('detele')
  async delete( @Body() dto: LoginRequest) {}

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout( @Res({passthrough: true}) res: Response ) {
    return await this.authService.logout(res);
  }

  @Authorization()
  @Get('@me')
  @HttpCode(HttpStatus.OK)
  async me(@Authorizated() user: any) {
    return user;
  }
}
