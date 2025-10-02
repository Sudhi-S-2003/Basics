import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {

  @IsNotEmpty()
  @IsString()
  item: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class GetOrdersDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsString()
  role?: string;
}