// gateway.service.ts
import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RegisterDto, LoginDto, VerifyTokenDto } from './dto/auth.dto';
import { CreateOrderDto } from './dto/order.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  private authClient: ClientProxy;
  private orderClient: ClientProxy;

  constructor() {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: 4001 },
    });

    this.orderClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: 4002 },
    });
  }

  async register(registerDto: RegisterDto) {
    return lastValueFrom(this.authClient.send({ cmd: 'register' }, registerDto));
  }

  async login(loginDto: LoginDto) {
    return lastValueFrom(this.authClient.send({ cmd: 'login' }, loginDto));
  }

  async verifyToken(verifyTokenDto: VerifyTokenDto) {
    return lastValueFrom(this.authClient.send({ cmd: 'verify_token' }, verifyTokenDto));
  }

  async getOrders(token: string) {
    // verify token first
    const verify = await this.verifyToken({ token });
    if (!verify.success) return { success: false, message: 'Invalid token' };
    const userId = verify.user?.userId || verify.userId;

    try {
      return await lastValueFrom(this.orderClient.send({ cmd: 'get_orders' }, { userId }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  async createOrder(token: string, body: CreateOrderDto) {
    const verify = await this.verifyToken({ token });
    if (!verify.success) return { success: false, message: 'Invalid token' };

    return lastValueFrom(this.orderClient.send({ cmd: 'create_order' }, {
      userId: verify.userId,
      item: body.item,
      quantity: body.quantity,
    }));
  }
}
