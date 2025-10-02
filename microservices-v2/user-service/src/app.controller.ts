import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('user.get_profile')
  async getUserProfile(data: { userId: string }) {
    return this.appService.getUserProfile(data.userId);
  }

  @MessagePattern('user.create_profile')
  async createProfile(data: any) {
    return this.appService.createProfile(data);
  }

  @MessagePattern('user.update_profile')
  async updateProfile(data: { userId: string; updates: any }) {
    return this.appService.updateProfile(data.userId, data.updates);
  }

  @MessagePattern('user.delete_profile')
  async deleteProfile(data: { userId: string }) {
    return this.appService.deleteProfile(data.userId);
  }
}