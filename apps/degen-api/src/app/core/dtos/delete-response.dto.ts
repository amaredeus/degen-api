import { ApiProperty } from '@nestjs/swagger';
import { DeleteResult as MongoDeleteResult } from 'mongodb';

export class DeleteResponseDTO implements MongoDeleteResult {
  @ApiProperty({
    description:
      'Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined.',
  })
  acknowledged: boolean;

  @ApiProperty({
    description: 'The number of documents that were deleted',
  })
  deletedCount: number;
}
