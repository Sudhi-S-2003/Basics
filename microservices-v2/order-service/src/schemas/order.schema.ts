import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true, default: 'pending' })
  status: string;

  @Prop({ type: Object })
  shippingAddress?: Record<string, any>;

  // Explicit type for Mongoose
  @Prop({
    type: {
      name: String,
      price: Number,
      description: String,
    },
  })
  productSnapshot?: {
    name: string;
    price: number;
    description?: string;
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
