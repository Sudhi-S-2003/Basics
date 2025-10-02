export declare class RegisterDto {
    email: string;
    password: string;
    role: string;
    name?: string;
    address?: string;
    phone?: string;
    department?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class VerifyTokenDto {
    token: string;
}
