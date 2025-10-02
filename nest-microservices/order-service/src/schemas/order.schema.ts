import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document & { createdAt: Date; updatedAt: Date };

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  item: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
