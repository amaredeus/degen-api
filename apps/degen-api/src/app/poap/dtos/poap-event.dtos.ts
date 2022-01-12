import { PoapParticipantsModel } from './../models/poap-participants.model';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';
import { PoapSettingsModel } from './../models/poap-settings.model';
import { Type } from 'class-transformer';

export class PoapEventResponseDTO extends PoapSettingsModel {
  @ValidateNested({ each: true })
  @Type(() => PoapParticipantsModel)
  @ApiProperty({
    type: () => PoapParticipantsModel,
    isArray: true,
  })
  participants: PoapParticipantsModel[];
}

export class PoapEventStartRequestDTO extends PickType(PoapSettingsModel, [
  'event',
  'discordUserId',
  'discordServerId',
  'voiceChannelId',
] as const) {
  @ApiProperty({ description: 'Duration of this event in minutes' })
  @IsNumber()
  duration: number;
}

export class PoapEventEndRequestDTO extends PickType(PoapSettingsModel, [
  'discordServerId',
  'voiceChannelId',
] as const) {}
