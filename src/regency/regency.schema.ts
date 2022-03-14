import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RegencyDocument = Regency & Document;

@Schema({ collection: 'regencies' })
export class Regency {
  @Prop({ isRequired: true, length: 4 })
  code: string;

  @Prop({ maxlength: 255 })
  name: string;

  @Prop({ isRequired: true, length: 2 })
  province_code: string;
}

export const RegencySchema = SchemaFactory.createForClass(Regency);

RegencySchema.virtual('districts', {
  ref: 'District',
  localField: 'code',
  foreignField: 'regency_code',
  justOne: false,
});
