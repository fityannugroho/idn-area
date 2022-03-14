import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'districts', toObject: { virtuals: true } })
export class District {
  @Prop({ isRequired: true, length: 6 })
  code: string;

  @Prop({ maxlength: 255 })
  name: string;

  @Prop({ isRequired: true, length: 6 })
  regency_code: string;
}

export type DistrictDocument = District & Document;
export const DistrictSchema = SchemaFactory.createForClass(District);

DistrictSchema.virtual('villages', {
  ref: 'Village',
  localField: 'code',
  foreignField: 'district_code',
  justOne: false,
});
