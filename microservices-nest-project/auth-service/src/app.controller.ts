import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('register')
  async register(data: { email: string; password: string }) {
    return  this.appService.register(data.email, data.password);
  }

  @MessagePattern('login')
  async login(data: { email: string; password: string }) {
    return this.appService.login(data.email, data.password);
  }

  @MessagePattern('verify_token')
  async verifyToken(data: { token: string }) {
    return this.appService.verifyToken(data.token);
  }
}