import { Model } from 'mongoose';
import { OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, GetOrdersDto } from './dto/order.dto';
export declare class OrderService {
    private orderModel;
    constructor(orderModel: Model<OrderDocument>);
    createOrder(createOrderDto: CreateOrderDto): Promise<{
        success: boolean;
        message: string;
        order: {
            id: unknown;
            userId: string;
            item: string;
            quantity: number;
            totalPrice: number;
            status: string;
            createdAt: Date;
        };
    } | {
        success: boolean;
        message: any;
        order?: undefined;
    }>;
    getOrders(getOrdersDto: GetOrdersDto): Promise<{
        success: boolean;
        count: any;
        orders: any;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        count?: undefined;
        orders?: undefined;
    }>;
}
