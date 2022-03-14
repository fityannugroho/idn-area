import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProvinceDocument = Province & Document;

@Schema({ collection: 'provinces', toObject: { virtuals: true } })
export class Province {
  @Prop({ isRequired: true, length: 2 })
  code: string;

  @Prop({ maxlength: 255 })
  name: string;
}

const ProvinceSchema = SchemaFactory.createForClass(Province);

ProvinceSchema.virtual('regencies', {
  ref: 'Regency',
  localField: 'code',
  foreignField: 'province_code',
  justOne: false,
});

export { ProvinceSchema };
