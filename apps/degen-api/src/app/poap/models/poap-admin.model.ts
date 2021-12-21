import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';
import { IsString } from 'class-validator';
import { BaseModel } from '../../core/models/base.model';

@modelOptions({ schemaOptions: { collection: 'poapAdmins' } })
export class PoapAdminDTO extends BaseModel {
  @IsString()
  @prop({ required: true })
  objectType: 'ROLE' | 'USER';

  @ApiProperty({
    description:
      'Discord Id of the user that is configured to use this command.',
  })
  @IsString()
  @prop({ required: true })
  discordObjectId: string;

  @ApiProperty({
    description:
      'Discord handle of the user that is configured to use this command',
  })
  @IsString()
  @prop({ required: true })
  discordObjectName: string;

  @ApiProperty({ description: 'Identifier of this discord guild' })
  @IsString()
  @prop({ required: true })
  discordServerId: string;

  @ApiProperty({ description: 'The name of this discord guild' })
  @IsString()
  @prop({ required: true })
  discordServerName: string;
}
