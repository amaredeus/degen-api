import { prop } from '@typegoose/typegoose';

/** Base mongo model */
export class BaseModel {
  @prop()
  _id: string;
}
