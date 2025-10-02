import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request, Headers } from '@nestjs/common';
import { AppService } from '../app.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createOrder(
    @Headers('authorization') auth: string,
    @Body() body: {
      productId: string;
      quantity: number;
      shippingAddress?: any;
    },
  ) {
    const token = auth?.split(' ')[1];
    return this.appService.createOrder({
      token,
      productId: body.productId,
      quantity: body.quantity,
      shippingAddress: body.shippingAddress,
    });
  }

  @Get()
  async getMyOrders(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.appService.getUserOrders(req.user.userId, page, limit);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.appService.getOrder(id);
  }

  @Put(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.appService.updateOrderStatus(id, body.status);
  }

  @Put(':id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.appService.cancelOrder(id);
  }
}