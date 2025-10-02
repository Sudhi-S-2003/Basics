import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyTokenDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(data: RegisterDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: unknown;
            email: string;
            role: string;
        };
    } | {
        success: boolean;
        message: any;
        user?: undefined;
    }>;
    login(data: LoginDto): Promise<{
        success: boolean;
        message: string;
        token?: undefined;
        user?: undefined;
    } | {
        success: boolean;
        message: string;
        token: string;
        user: {
            id: unknown;
            email: string;
            role: string;
        };
    }>;
    verifyToken(data: VerifyTokenDto): Promise<{
        success: boolean;
        user: import("jsonwebtoken").JwtPayload;
        userId: any;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        user?: undefined;
        userId?: undefined;
    }>;
    getCustomersMessage(): Promise<{
        success: boolean;
        customers: (import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}, {}> & import("./schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        customers?: undefined;
    }>;
}
