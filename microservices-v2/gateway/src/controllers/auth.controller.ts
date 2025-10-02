import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from '../app.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @Post('register/email')
  async registerEmail(@Body() body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.appService.registerWithEmail(body);
  }

  @Post('register/phone')
  async registerPhone(@Body() body: {
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.appService.registerWithPhone(body);
  }

  @Post('register/google')
  async registerGoogle(@Body() body: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    return this.appService.registerWithGoogle(body);
  }

  @Post('login/email')
  async loginEmail(@Body() body: { email: string; password: string }) {
    return this.appService.loginWithEmail(body);
  }

  @Post('login/phone')
  async loginPhone(@Body() body: { phone: string; password: string }) {
    return this.appService.loginWithPhone(body);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { token: string }) {
    return this.appService.refreshToken(body.token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.appService.logout(token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return { success: true, user: req.user };
  }
}
