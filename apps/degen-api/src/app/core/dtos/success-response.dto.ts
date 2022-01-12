import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDTO {
  @ApiProperty({
    description: 'Indicates whether this operation completed successfully',
  })
  success: boolean;
}
