import { RegisterDto, LoginDto, VerifyTokenDto } from './dto/auth.dto';
import { CreateOrderDto } from './dto/order.dto';
export declare class GatewayService {
    private authClient;
    private orderClient;
    constructor();
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    verifyToken(verifyTokenDto: VerifyTokenDto): Promise<any>;
    getOrders(token: string): Promise<any>;
    createOrder(token: string, body: CreateOrderDto): Promise<any>;
}
