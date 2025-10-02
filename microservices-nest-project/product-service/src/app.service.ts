import { Injectable } from '@nestjs/common';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable()
export class AppService {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Mouse', price: 29.99 },
    { id: 3, name: 'Keyboard', price: 79.99 },
    { id: 4, name: 'Monitor', price: 299.99 },
  ];

  getProductById(productId: number) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, message: 'Product not found' };
    }
    return { success: true, product };
  }
}