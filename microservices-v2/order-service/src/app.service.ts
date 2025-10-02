import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { Observable, throwError, lastValueFrom } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.retryConnect(this.authClient, 'Auth Service');
    await this.retryConnect(this.productClient, 'Product Service');
    console.log('✅ Order Service: Connected to Auth and Product services');
  }

  private async retryConnect(
    client: ClientProxy,
    name: string,
    retries = 5,
    delayMs = 1000,
  ) {
    for (let i = 0; i < retries; i++) {
      try {
        await client.connect();
        console.log(`✅ ${name}: Connected`);
        return;
      } catch {
        console.warn(
          `⚠️ ${name}: Connection failed, retrying in ${delayMs}ms...`,
        );
        await new Promise(res => setTimeout(res, delayMs));
      }
    }
    throw new Error(`${name} connection failed after ${retries} retries`);
  }

  async createOrder(data: {
    token: string;
    productId: string;
    quantity: number;
    shippingAddress?: Record<string, unknown>;
  }): Promise<any> {
    try {
      // Step 1: Verify authentication token
      interface AuthVerifyResponse {
        success: boolean;
        user?: { id: string };
        message?: string;
      }
      const authResponse: AuthVerifyResponse = await lastValueFrom(
        this.authClient.send('auth.verify_token', { token: data.token }),
      );
      if (!authResponse.success) {
        return { success: false, message: 'Unauthorized: Invalid token' };
      }
      const userId = authResponse?.user?.id;

      // Step 2: Check product stock
      interface StockResponse {
        success: boolean;
        message?: string;
        available?: boolean;
      }
      const stockResponse: StockResponse = await lastValueFrom(
        this.productClient.send('product.check_stock', {
          productId: data.productId,
          quantity: data.quantity,
        })
      );
      if (!stockResponse.success) {
        return { success: false, message: stockResponse.message };
      }

      // Step 3: Get product details
      interface ProductResponse {
        success: boolean;
        product?: {
          name: string;
          price: number;
          description?: string;
        };
        message?: string;
      }
      const productResponse: ProductResponse = await lastValueFrom(
        this.productClient.send('product.get_by_id', { 
          productId: data.productId,
        }),
      );
      if (!productResponse.success || !productResponse.product) {
        return { success: false, message: 'Product not found' };
      }
      const product = productResponse.product;

      // Step 4: Create order in DB
      const totalAmount = product.price * data.quantity;
      const order = await this.orderModel.create({
        userId,
        productId: data.productId,
        quantity: data.quantity,
        totalAmount,
        status: 'pending',
        shippingAddress: data.shippingAddress
          ? { ...data.shippingAddress }
          : undefined,
        productSnapshot: {
          name: product.name,
          price: product.price,
          description: product.description,
        },
      });

      return {
        success: true,
        message: 'Order created successfully',
        order: {
          id: (order._id as string | { toString(): string }).toString(),
          userId: order.userId,
          productId: order.productId,
          quantity: order.quantity,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.get('createdAt') as Date,
        },
      };
    } catch (error: any) {
      const errorMsg =
        error && typeof error === 'object' && 'message' in error
          ? ((error as { message?: string }).message ?? String(error))
          : String(error);
      console.error('[createOrder] Error:', errorMsg);
      return { success: false, message: errorMsg || 'Failed to create order' };
    }
  }

  async getOrderById(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);
      if (!order) return { success: false, message: 'Order not found' };
      return { success: true, order };
    } catch (error: any) {
      const errorMsg =
        error && typeof error === 'object' && 'message' in error
          ? ((error as { message?: string }).message ?? String(error))
          : String(error);
      return { success: false, message: errorMsg };
    }
  }

  async getUserOrders(userId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const orders = await this.orderModel
        .find({ userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await this.orderModel.countDocuments({ userId });

      return {
        success: true,
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      const errorMsg =
        error && typeof error === 'object' && 'message' in error
          ? ((error as { message?: string }).message ?? String(error))
          : String(error);
      return { success: false, message: errorMsg };
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    try {
      const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
      if (!order) return { success: false, message: 'Order not found' };
      return { success: true, order };
    } catch (error: any) {
      const errorMsg =
        error && typeof error === 'object' && 'message' in error
          ? ((error as { message?: string }).message ?? String(error))
          : String(error);
      return { success: false, message: errorMsg };
    }
  }

  async cancelOrder(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);
      if (!order) return { success: false, message: 'Order not found' };

      if (order.status === 'delivered' || order.status === 'cancelled') {
        return { success: false, message: 'Order cannot be cancelled' };
      }

      order.status = 'cancelled';
      await order.save();

      return { success: true, message: 'Order cancelled successfully' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}
