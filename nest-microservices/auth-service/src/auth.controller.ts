import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyTokenDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Microservice endpoints
  @MessagePattern({ cmd: 'register' })
  async register(data: RegisterDto) {
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'login' })
  async login(data: LoginDto) {
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'verify_token' })
  async verifyToken(data: VerifyTokenDto) {
    return this.authService.verifyToken(data);
  }

  // Optional HTTP endpoint for testing via REST
  @MessagePattern({ cmd: 'get_customers' })
  async getCustomersMessage() {
    return this.authService.getCustomers();
  }

}
