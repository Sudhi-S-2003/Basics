import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, discriminatorKey: 'role' })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['customer', 'admin'], default: 'customer' })
  role: string;

  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Child schemas only contain **extra fields**
@Schema()
export class Customer {
  @Prop()
  address: string;

  @Prop()
  phone: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

@Schema()
export class Admin {
  @Prop()
  department: string;

  @Prop({ default: true })
  canManageOrders: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
