import { PoapEventResponseDTO } from './../dtos/poap-event.dtos';
import { PoapAdminService } from './../services/poap-admin.service';
import { PoapEventService } from './../services/poap-event.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  PoapEventEndRequestDTO,
  PoapEventStartRequestDTO,
} from '../dtos/poap-event.dtos';
import { SuccessResponseDTO } from '../../core/dtos/success-response.dto';
import { ApiKeyGuard } from '../../core/guards/apikey.guard';

@ApiTags('POAP Event')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard)
@Controller({
  path: 'poap/event',
  version: '1',
})
export class PoapEventController {
  constructor(
    private poapAdminService: PoapAdminService,
    private poapEventService: PoapEventService
  ) {}

  @ApiOperation({
    description: 'Get a list of all POAP events for the given guild',
  })
  @ApiResponse({ type: PoapEventResponseDTO })
  @Get(':guildId')
  async getPoapEvents(@Param('guildId') guildId: string) {
    return this.poapEventService.getEvents(guildId);
  }

  @ApiOperation({ description: 'Start a new POAP event' })
  @ApiResponse({ type: SuccessResponseDTO })
  @Post('start')
  async startPoapEvent(
    @Body() poapEventStartRequestDTO: PoapEventStartRequestDTO
  ): Promise<SuccessResponseDTO> {
    // Verify admin
    const { discordServerId, discordUserId } = poapEventStartRequestDTO;
    await this.poapAdminCheck(discordServerId, discordUserId);

    // Start event
    await this.poapEventService.startEvent(poapEventStartRequestDTO);
    return { success: true };
  }

  @ApiOperation({ description: 'End an existing POAP event' })
  @ApiResponse({ type: SuccessResponseDTO })
  @Post('end')
  async endPoapEvent(
    @Body() poapEventEndRequestDTO: PoapEventEndRequestDTO
  ): Promise<SuccessResponseDTO> {
    await this.poapEventService.endEvent(poapEventEndRequestDTO);
    return { success: true };
  }

  /**
   * Didn't abstract this to a guard because it isn't used enough to expect the
   * shape of request bodies to meet this interface. If this becomes common create that
   * interface and then the guard can be used on endpoints with bodies that meet it
   */
  private async poapAdminCheck(discordServerId: string, discordUserId: string) {
    const isPoapAdmin = await this.poapAdminService.isPoapAdmin(
      discordServerId,
      discordUserId
    );
    if (!isPoapAdmin) {
      throw new UnauthorizedException(
        'User must be a POAP admin to start an event'
      );
    }
  }
}
