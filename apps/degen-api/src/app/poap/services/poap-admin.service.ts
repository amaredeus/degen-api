import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { PoapAdminDTO } from '../models/poap-admin.model';
import { DiscordClientProvider } from '@discord-nestjs/core';
import { Client } from 'discord.js';

@Injectable()
export class PoapAdminService {
  client: Client;

  constructor(
    @InjectModel(PoapAdminDTO)
    private readonly poapAdminModel: ReturnModelType<typeof PoapAdminDTO>,
    private readonly discordClientProvider: DiscordClientProvider
  ) {
    this.client = this.discordClientProvider.getClient();
  }

  /** Checks if the given user is an admin for this guild */
  async isPoapAdmin(guildId: string, userId: string) {
    const admins = await this.poapAdminModel.find({
      discordServerId: guildId,
      discordObjectId: userId,
    });
    return admins?.length > 0;
  }

  /** Returns all poapAdmins for this guild */
  async getPoapAdmins(guildId: string) {
    return await this.poapAdminModel.find({ discordServerId: guildId });
  }

  /** Adds the given user as a poap admin for this guild */
  async addPoapAdmin(guildId: string, userId: string) {
    const guild = await this.client.guilds.fetch(guildId).catch((e) => {
      throw new NotFoundException(`Could not find guild with ID: ${guildId}`);
    });
    const guildMember = await guild.members.fetch(userId).catch((e) => {
      throw new NotFoundException(
        `Could not find guild member with ID: ${userId}`
      );
    });
    const poapAdmin = await this.poapAdminModel.create({
      objectType: '???',
      discordObjectId: userId,
      discordObjectName: guildMember.displayName,
      discordServerId: guildId,
      discordServerName: guild.name,
    });
    return poapAdmin;
  }

  /** Deletes a poapAdmin by id */
  async deletePoapAdmin(_id: string) {
    return await this.poapAdminModel.deleteOne({
      _id: _id,
    });
  }
}
