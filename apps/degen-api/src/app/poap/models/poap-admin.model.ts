import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { IsString } from 'class-validator';

export class PoapAdminDTO {
  @prop({ required: true })
  _id: string;

  @IsString()
  @prop({ required: true })
  objectType: string;

  @IsString()
  @prop({ required: true })
  discordObjectId: string;

  @IsString()
  @prop({ required: true })
  discordObjectName: string;

  @IsString()
  @prop({ required: true })
  discordServerId: string;

  @IsString()
  @prop({ required: true })
  discordServerName: string;
}
