import { Response, Request } from 'express';
import { GatewayService } from './gateway.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { CreateOrderDto } from './dto/order.dto';
export declare class GatewayController {
    private readonly gatewayService;
    constructor(gatewayService: GatewayService);
    register(body: RegisterDto): Promise<any>;
    login(body: LoginDto, res: Response): Promise<{
        success: boolean;
        message: any;
        user: any;
    }>;
    logout(res: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    getOrders(req: Request): Promise<any>;
    createOrder(req: Request, body: CreateOrderDto): Promise<any>;
}
