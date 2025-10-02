import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, GetOrdersDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      // Calculate total price (example: $10 per item)
      const totalPrice = createOrderDto.quantity * 10;

      const order = new this.orderModel({
        userId: createOrderDto.userId,
        item: createOrderDto.item,
        quantity: createOrderDto.quantity,
        totalPrice,
        status: 'pending',
      });

      await order.save();

      return {
        success: true,
        message: 'Order created successfully',
        order: {
          id: order._id,
          userId: order.userId,
          item: order.item,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          status: order.status,
          createdAt: order.createdAt,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getOrders(getOrdersDto: GetOrdersDto) {
    try {
      let orders;

      // If user is admin, return all orders
      // If user is customer, return only their orders
      if (getOrdersDto.role === 'admin') {
        orders = await this.orderModel.find().sort({ createdAt: -1 });
      } else {
        orders = await this.orderModel
          .find({ userId: getOrdersDto.userId })
          .sort({ createdAt: -1 });
      }

      return {
        success: true,
        count: orders.length,
        orders: orders.map(order => ({
          id: order._id,
          userId: order.userId,
          item: order.item,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          status: order.status,
          createdAt: order.createdAt,
        })),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}