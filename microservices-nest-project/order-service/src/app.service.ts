import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

interface Order {
  id: number;
  userId: number;
  productId: number;
  total: number;
  createdAt: Date;
}

@Injectable()
export class AppService {
  private orders: Order[] = [];
  private currentId = 1;

  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
  ) {}

  createOrder(
    token: string,
    userId: number,
    productId: number,
  ): Observable<any> {
    return this.authClient.send('verify_token', { token }).pipe(
      switchMap((authResponse: any) => {
        if (!authResponse.success) {
          return throwError(() => new Error('Unauthorized'));
        }

        return this.productClient.send('get_product', { productId }).pipe(
          map((productResponse: any) => {
            if (!productResponse.success) {
              throw new Error('Product not found');
            }

            const order: Order = {
              id: this.currentId++,
              userId,
              productId,
              total: productResponse.product.price,
              createdAt: new Date(),
            };

            this.orders.push(order);

            return {
              success: true,
              message: 'Order created successfully',
              order,
            };
          }),
        );
      }),
      catchError((error) => {
        return throwError(() => ({
          success: false,
          message: error.message || 'Failed to create order',
        }));
      }),
    );
  }
}