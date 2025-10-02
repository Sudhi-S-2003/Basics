import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto, LoginDto, VerifyTokenDto } from './dto/auth.dto';
export declare class AuthService {
    private userModel;
    private readonly JWT_SECRET;
    constructor(userModel: Model<UserDocument>);
    register(registerDto: RegisterDto): Promise<{
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
    login(loginDto: LoginDto): Promise<{
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
    verifyToken(verifyTokenDto: VerifyTokenDto): Promise<{
        success: boolean;
        user: jwt.JwtPayload;
        userId: any;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        user?: undefined;
        userId?: undefined;
    }>;
    getCustomers(): Promise<{
        success: boolean;
        customers: (import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
