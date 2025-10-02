import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    this.seedProducts();
  }

  async seedProducts() {
    const count = await this.productModel.countDocuments();
    if (count === 0) {
      await this.productModel.insertMany([
        {
          name: 'Laptop Pro',
          price: 1299.99,
          description: 'High-performance laptop',
          stock: 50,
          category: 'Electronics',
          isAvailable: true,
        },
        {
          name: 'Wireless Mouse',
          price: 29.99,
          description: 'Ergonomic wireless mouse',
          stock: 200,
          category: 'Accessories',
          isAvailable: true,
        },
        {
          name: 'Mechanical Keyboard',
          price: 89.99,
          description: 'RGB mechanical keyboard',
          stock: 100,
          category: 'Accessories',
          isAvailable: true,
        },
        {
          name: '4K Monitor',
          price: 399.99,
          description: '27-inch 4K display',
          stock: 75,
          category: 'Electronics',
          isAvailable: true,
        },
      ]);
      console.log('✅ Products seeded successfully');
    }
  }

  async getProductById(productId: string) {
    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        return { success: false, message: 'Product not found' };
      }
      return { success: true, product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getAllProducts(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await this.productModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await this.productModel.countDocuments();

      return {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async createProduct(data: any) {
    try {
      const product = await this.productModel.create(data);
      return { success: true, product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateProduct(productId: string, updates: any) {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        productId,
        { $set: updates },
        { new: true },
      );

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      return { success: true, product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteProduct(productId: string) {
    try {
      const result = await this.productModel.deleteOne({ _id: productId });
      if (result.deletedCount === 0) {
        return { success: false, message: 'Product not found' };
      }
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async checkStock(productId: string, quantity: number) {
    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      if (!product.isAvailable) {
        return { success: false, message: 'Product is not available' };
      }

      if (product.stock < quantity) {
        return {
          success: false,
          message: 'Insufficient stock',
          available: product.stock,
        };
      }

      return { success: true, available: true, stock: product.stock };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async decreaseStock(productId: string, quantity: number) {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity } },
        { new: true },
      );

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      return { success: true, product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}