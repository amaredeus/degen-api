import { PoapAdminModel } from './../models/poap-admin.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PoapAdminsResponseDTO {
  @ApiProperty({
    isArray: true,
    type: PoapAdminModel,
    description: 'Array of POAP admins for this guild',
  })
  poapAdmins: PoapAdminModel[];
}

export class AddPoapAdminRequestDTO {
  @ApiProperty({
    description:
      'The guild ID of the server to which the POAP admin will be added',
  })
  @IsString()
  guildId: string;

  @ApiProperty({
    description: 'The user ID of the user to be added as a POAP admin',
  })
  @IsString()
  userId: string;
}

export class DeletePoapAdminRequestDTO {
  @ApiProperty({
    description: 'ID of the POAP admin entity to be deleted',
  })
  @IsString()
  _id: string;
}
