import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AppService } from '../app.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly appService: AppService) {}

  @Get('profile')
  async getMyProfile(@Request() req) {
    return this.appService.getUserProfile(req.user.userId);
  }

  @Post('profile')
  async createProfile(@Request() req, @Body() body: any) {
    return this.appService.createUserProfile({
      userId: req.user.userId,
      ...body,
    });
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() body: any) {
    return this.appService.updateUserProfile(req.user.userId, body);
  }

  @Delete('profile')
  async deleteProfile(@Request() req) {
    return this.appService.deleteUserProfile(req.user.userId);
  }
}