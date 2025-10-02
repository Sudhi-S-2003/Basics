import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
  ) {}

  async register(email: string, password: string): Promise<any> {
    return lastValueFrom(
      this.authClient.send('register', { email, password }),
    );
  }

  async login(email: string, password: string): Promise<any> {
    return lastValueFrom(this.authClient.send('login', { email, password }));
  }

  async createOrder(token: string, userId: number, productId: number): Promise<any> {
    return lastValueFrom(
      this.orderClient.send('create_order', { token, userId, productId }),
    );
  }

  async getUser(userId: number): Promise<any> {
    return lastValueFrom(this.userClient.send('get_user', { userId }));
  }

  async getProduct(productId: number): Promise<any> {
    return lastValueFrom(
      this.productClient.send('get_product', { productId }),
    );
  }
}