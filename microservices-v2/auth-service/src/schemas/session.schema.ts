import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ type: Object })
  device?: {
    userAgent: string;
    ip: string;
  };

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isValid: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);