import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile, UserProfileDocument } from './schemas/user-profile.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(UserProfile.name)
    private userProfileModel: Model<UserProfileDocument>,
  ) {}

  async getUserProfile(userId: string) {
    try {
      const profile = await this.userProfileModel.findOne({ userId });
      if (!profile) {
        return { success: false, message: 'Profile not found' };
      }
      return { success: true, profile };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async createProfile(data: any) {
    try {
      const existingProfile = await this.userProfileModel.findOne({
        userId: data.userId,
      });

      if (existingProfile) {
        return { success: false, message: 'Profile already exists' };
      }

      const profile = await this.userProfileModel.create(data);
      return { success: true, profile };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateProfile(userId: string, updates: any) {
    try {
      const profile = await this.userProfileModel.findOneAndUpdate(
        { userId },
        { $set: updates },
        { new: true },
      );

      if (!profile) {
        return { success: false, message: 'Profile not found' };
      }

      return { success: true, profile };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteProfile(userId: string) {
    try {
      const result = await this.userProfileModel.deleteOne({ userId });
      if (result.deletedCount === 0) {
        return { success: false, message: 'Profile not found' };
      }
      return { success: true, message: 'Profile deleted successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
