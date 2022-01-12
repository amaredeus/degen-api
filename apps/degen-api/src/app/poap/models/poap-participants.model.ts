import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';
import { IsBoolean, IsISO8601, IsNumber, IsString } from 'class-validator';
import { BaseModel } from '../../core/models/base.model';

@modelOptions({ schemaOptions: { collection: 'poapParticipants' } })
export class PoapParticipantsModel extends BaseModel {
  @ApiProperty({
    description:
      'The event for the discussion which should be an enum, COMMUNITY_CALL',
  })
  @IsString()
  @prop()
  event: string;

  @ApiProperty({
    description: 'Discord Id of the participant',
  })
  @IsString()
  @prop({ required: true })
  discordUserId: string;

  @ApiProperty({
    description: 'Discord tag of the participant',
  })
  @IsString()
  @prop({ required: true })
  discordUserTag: string;

  @ApiProperty({ description: 'ISO8601 of when the meeting started' })
  @IsISO8601()
  @prop({ required: true })
  startTime: string;

  @ApiProperty({ description: 'ISO8601 of when the meeting ended' })
  @IsISO8601()
  @prop()
  endTime: string;

  @ApiProperty({ description: 'Identifier for the voice/stage channel' })
  @IsString()
  @prop({ required: true })
  voiceChannelId: string;

  @ApiProperty({ description: 'Identifier for the discord guild' })
  @IsString()
  @prop({ required: true })
  discordServerId: string;

  @ApiProperty({
    description: 'The number of minutes the participants has remained on call',
  })
  @IsNumber()
  @prop({ required: true })
  durationInMinutes: number;
}
