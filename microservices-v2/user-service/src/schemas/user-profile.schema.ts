import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

@Schema({ timestamps: true })
export class UserProfile {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop()
  bio?: string;

  @Prop()
  avatar?: string;

  @Prop({ type: Object })
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @Prop({ type: Object })
  preferences?: {
    language: string;
    timezone: string;
    notifications: boolean;
  };

  @Prop({ type: [String], default: [] })
  interests: string[];
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);