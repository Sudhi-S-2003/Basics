import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Object })
  name: {
    first: string;
    last: string;
  };

  @Prop({ type: Object, unique: true, sparse: true })
  email?: {
    value: string;
    verified: boolean;
  };

  @Prop({ type: Object, unique: true, sparse: true })
  phone?: {
    number: string;
    verified: boolean;
  };

  @Prop()
  password?: string;

  @Prop({ type: String, enum: ['user', 'admin', 'guest'], default: 'user' })
  role: string;

  @Prop({ type: Object })
  google?: {
    id: string;
    email: string;
    picture: string;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);