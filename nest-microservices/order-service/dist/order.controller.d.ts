import { OrderService } from './order.service';
import { CreateOrderDto, GetOrdersDto } from './dto/order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(data: CreateOrderDto): Promise<{
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
    getOrders(data: GetOrdersDto): Promise<{
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
