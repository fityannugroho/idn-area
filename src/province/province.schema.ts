import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProvinceDocument = Province & Document;

@Schema({ collection: 'provinces', _id: false })
export class Province {
  @Prop({ isRequired: true, length: 2 })
  code: string;

  @Prop({ maxlength: 255 })
  name: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
