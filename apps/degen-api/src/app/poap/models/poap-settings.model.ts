import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';
import { IsBoolean, IsISO8601, IsString } from 'class-validator';
import { BaseModel } from '../../core/models/base.model';

@modelOptions({ schemaOptions: { collection: 'poapSettings' } })
export class PoapSettingsModel extends BaseModel {
  @ApiProperty({
    description:
      'The event for the discussion which should be an enum, COMMUNITY_CALL',
  })
  @IsString()
  @prop()
  event: string;

  @ApiProperty({
    description: 'Indicator whether the call is currently active',
  })
  @IsBoolean()
  @prop({ required: true })
  isActive: boolean;

  @ApiProperty({ description: 'ISO8601 of when the meeting started' })
  @IsISO8601()
  @prop({ required: true })
  startTime: string;

  @ApiProperty({ description: 'ISO8601 of when the meeting ended' })
  @IsISO8601()
  @prop({ required: true })
  endTime: string;

  @ApiProperty({
    description:
      'Discord Id of the user that is configured to use this command',
  })
  @IsString()
  @prop({ required: true })
  discordUserId: string;

  @ApiProperty({ description: 'Identifier for the voice/stage channel' })
  @IsString()
  @prop({ required: true })
  voiceChannelId: string;

  @ApiProperty({ description: 'The name for the voice/stage channel' })
  @IsString()
  @prop({ required: true })
  voiceChannelName: string;

  @ApiProperty({ description: 'Identifier for the discord guild' })
  @IsString()
  @prop({ required: true })
  discordServerId: string;
}
