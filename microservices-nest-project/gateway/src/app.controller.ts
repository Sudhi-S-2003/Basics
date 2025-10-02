import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.appService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.appService.login(body.email, body.password);
  }

  @Post('order')
  async createOrder(
    @Body() body: { token: string; userId: number; productId: number },
  ) {
    return this.appService.createOrder(body.token, body.userId, body.productId);
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return this.appService.getUser(parseInt(id));
  }

  @Get('product/:id')
  async getProduct(@Param('id') id: string) {
    return this.appService.getProduct(parseInt(id));
  }
}
