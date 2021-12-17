import { AddPoapAdminDTO, DeletePoapAdminDTO } from './poap.dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PoapService } from './poap.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('POAP')
@Controller('poap')
export class PoapController {
  constructor(private poapService: PoapService) {}

  @ApiOperation({
    description: 'Get a list of all poap admins for the given guild',
  })
  @Get('admin/:guildId')
  async getAdmins(@Param('guildId') guildId: string) {
    return {
      poapAdmins: await this.poapService.getPoapAdmins(guildId),
    };
  }

  @ApiOperation({
    description: 'Add a poap admin for the given guild',
  })
  @Post('admin')
  async addAdmin(@Body() addPoapAdmin: AddPoapAdminDTO) {
    const { guildId, userId } = addPoapAdmin;
    return this.poapService.addPoapAdmin(guildId, userId);
  }

  @ApiOperation({
    description: 'Delete a poap admin for the given guild',
  })
  @Delete('admin')
  async deleteAdmin(@Body() deletePoapAdmin: DeletePoapAdminDTO) {
    const { _id } = deletePoapAdmin;
    const result = await this.poapService.deletePoapAdmin(_id);
    if (result?.deletedCount > 0) {
      return result;
    } else {
      throw new NotFoundException('User not found.');
    }
  }
}
