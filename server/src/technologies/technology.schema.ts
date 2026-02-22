import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Technology extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  ring?: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  reason?: string;

  @Prop({ default: new Date(), required: true })
  createdAt: Date;

  @Prop()
  changedAt: Date;

  @Prop({ default: false })
  isPublished: boolean;
}

export const TechnologySchema = SchemaFactory.createForClass(Technology);
