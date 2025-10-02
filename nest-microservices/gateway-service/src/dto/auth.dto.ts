// auth/dto/auth.dto.ts
import { IsEmail, IsNotEmpty, IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(['customer', 'admin'])
  role: string;

  @IsOptional()
  @IsString()
  name?: string;

  // customer
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // admin
  @IsOptional()
  @IsString()
  department?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class VerifyTokenDto {
  @IsNotEmpty()
  token: string;
}

// order/dto/order.dto.ts
export class CreateOrderDto {
  @IsNotEmpty()
  item: string;

  @IsNumber()
  quantity: number;
}
