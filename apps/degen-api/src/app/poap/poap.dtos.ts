import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddPoapAdminDTO {
  @ApiProperty()
  @IsString()
  guildId: string;

  @ApiProperty()
  @IsString()
  userId: string;
}

export class DeletePoapAdminDTO {
  @ApiProperty()
  @IsString()
  _id: string;
}
