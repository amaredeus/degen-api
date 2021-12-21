import { DeleteResponseDTO } from '../../core/dtos/delete-response.dto';
import { PoapAdminModel } from './../models/poap-admin.model';
import {
  AddPoapAdminRequestDTO,
  DeletePoapAdminRequestDTO,
  PoapAdminsResponseDTO,
} from '../dtos/poap-admin.dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { PoapAdminService } from '../services/poap-admin.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('POAP Admin')
@Controller({
  path: 'poap/admin',
  version: '1',
})
export class PoapAdminController {
  constructor(private poapAdminService: PoapAdminService) {}

  @ApiOperation({
    description: 'Get a list of all POAP admins for the given guild',
  })
  @ApiResponse({ type: PoapAdminsResponseDTO })
  @Get(':guildId')
  async getAdmins(
    @Param('guildId') guildId: string
  ): Promise<PoapAdminsResponseDTO> {
    return {
      poapAdmins: await this.poapAdminService.getPoapAdmins(guildId),
    };
  }

  @ApiOperation({
    description: 'Add a POAP admin for the given guild',
  })
  @ApiResponse({ type: PoapAdminModel, isArray: true })
  @Post()
  async addAdmin(@Body() addPoapAdmin: AddPoapAdminRequestDTO) {
    const { guildId, userId } = addPoapAdmin;
    return this.poapAdminService.addPoapAdmin(guildId, userId);
  }

  @ApiOperation({
    description: 'Delete a POAP admin for the given guild',
  })
  @ApiResponse({ type: DeleteResponseDTO })
  @Delete()
  async deleteAdmin(
    @Body() deletePoapAdmin: DeletePoapAdminRequestDTO
  ): Promise<DeleteResponseDTO> {
    const { _id } = deletePoapAdmin;
    const result = await this.poapAdminService.deletePoapAdmin(_id);
    if (result?.deletedCount > 0) {
      return result;
    } else {
      throw new NotFoundException('User not found.');
    }
  }
}
