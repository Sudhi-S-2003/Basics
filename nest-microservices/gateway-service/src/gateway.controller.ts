// gateway.controller.ts
import { Controller, Post, Get, Body, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { GatewayService } from './gateway.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { CreateOrderDto } from './dto/order.dto';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const result = await this.gatewayService.register(body);
    if (!result.success) throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    return result;
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.gatewayService.login(body);
    if (!result.success) throw new HttpException(result.message, HttpStatus.UNAUTHORIZED);

    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    return { success: true, message: result.message, user: result.user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    return { success: true, message: 'Logged out successfully' };
  }

  @Get('orders')
  async getOrders(@Req() req: Request) {
    const token = req.cookies['auth_token'];
    if (!token) throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);

    const result = await this.gatewayService.getOrders(token);
    if (!result.success) throw new HttpException(result.message, HttpStatus.UNAUTHORIZED);
    return result;
  }

  @Post('orders')
  async createOrder(@Req() req: Request, @Body() body: CreateOrderDto) {
    const token = req.cookies['auth_token'];
    if (!token) throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);

    const result = await this.gatewayService.createOrder(token, body);
    if (!result.success) throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    return result;
  }
}
