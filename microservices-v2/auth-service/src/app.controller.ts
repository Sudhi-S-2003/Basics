import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth.register.email')
  async registerWithEmail(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.appService.registerWithEmail(data);
  }

  @MessagePattern('auth.register.phone')
  async registerWithPhone(data: {
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.appService.registerWithPhone(data);
  }

  @MessagePattern('auth.register.google')
  async registerWithGoogle(data: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    return this.appService.registerWithGoogle(data);
  }

  @MessagePattern('auth.login.email')
  async loginWithEmail(data: { email: string; password: string }) {
    return this.appService.loginWithEmail(data.email, data.password);
  }

  @MessagePattern('auth.login.phone')
  async loginWithPhone(data: { phone: string; password: string }) {
    return this.appService.loginWithPhone(data.phone, data.password);
  }

  @MessagePattern('auth.verify_token')
  async verifyToken(data: { token: string }) {
    return this.appService.verifyToken(data.token);
  }

  @MessagePattern('auth.refresh_token')
  async refreshToken(data: { token: string }) {
    return this.appService.refreshToken(data.token);
  }

  @MessagePattern('auth.logout')
  async logout(data: { token: string }) {
    return this.appService.logout(data.token);
  }

  @MessagePattern('auth.get_user_by_id')
  async getUserById(data: { userId: string }) {
    return this.appService.getUserById(data.userId);
  }

  @MessagePattern('auth.get_user_by_email')
  async getUserByEmail(data: { email: string }) {
    return this.appService.getUserByEmail(data.email);
  }

  @MessagePattern('auth.get_user_by_phone')
  async getUserByPhone(data: { phone: string }) {
    return this.appService.getUserByPhone(data.phone);
  }
}