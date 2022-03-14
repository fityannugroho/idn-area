import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'villages' })
export class Village {
  @Prop({ isRequired: true, length: 10 })
  code: string;

  @Prop({ maxlength: 255 })
  name: string;
}

export type VillageDocument = Village & Document;

export const VillageSchema = SchemaFactory.createForClass(Village);
