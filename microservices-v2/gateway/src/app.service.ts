import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.authClient.connect(),
      this.userClient.connect(),
      this.productClient.connect(),
      this.orderClient.connect(),
    ]);
    console.log('✅ Gateway: All microservice connections established');
  }

  // Auth methods
  async registerWithEmail(data: any): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.register.email', data));
  }

  async registerWithPhone(data: any): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.register.phone', data));
  }

  async registerWithGoogle(data: any): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.register.google', data));
  }

  async loginWithEmail(data: any): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.login.email', data));
  }

  async loginWithPhone(data: any): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.login.phone', data));
  }

  async refreshToken(token: string): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.refresh_token', { token }));
  }

  async logout(token: string): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.logout', { token }));
  }

  // User methods
  async getUserProfile(userId: string): Promise<any> {
    return lastValueFrom(this.userClient.send('user.get_profile', { userId }));
  }

  async createUserProfile(data: any): Promise<any> {
    return lastValueFrom(this.userClient.send('user.create_profile', data));
  }

  async updateUserProfile(userId: string, updates: any): Promise<any> {
    return lastValueFrom(
      this.userClient.send('user.update_profile', { userId, updates }),
    );
  }

  async deleteUserProfile(userId: string): Promise<any> {
    return lastValueFrom(this.userClient.send('user.delete_profile', { userId }));
  }

  // Product methods
  async getAllProducts(page?: number, limit?: number): Promise<any> {
    return lastValueFrom(
      this.productClient.send('product.get_all', { page, limit }),
    );
  }

  async getProduct(productId: string): Promise<any> {
    return lastValueFrom(
      this.productClient.send('product.get_by_id', { productId }),
    );
  }

  async createProduct(data: any): Promise<any> {
    return lastValueFrom(this.productClient.send('product.create', data));
  }

  async updateProduct(productId: string, updates: any): Promise<any> {
    return lastValueFrom(
      this.productClient.send('product.update', { productId, updates }),
    );
  }

  async deleteProduct(productId: string): Promise<any> {
    return lastValueFrom(
      this.productClient.send('product.delete', { productId }),
    );
  }

  // Order methods
  async createOrder(data: any): Promise<any> {
    return lastValueFrom(this.orderClient.send('order.create', data));
  }

  async getUserOrders(userId: string, page?: number, limit?: number): Promise<any> {
    return lastValueFrom(
      this.orderClient.send('order.get_user_orders', { userId, page, limit }),
    );
  }

  async getOrder(orderId: string): Promise<any> {
    return lastValueFrom(this.orderClient.send('order.get_by_id', { orderId }));
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return lastValueFrom(
      this.orderClient.send('order.update_status', { orderId, status }),
    );
  }

  async cancelOrder(orderId: string): Promise<any> {
    return lastValueFrom(this.orderClient.send('order.cancel', { orderId }));
  }
}