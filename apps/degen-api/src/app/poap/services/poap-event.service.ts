import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PoapEventStartRequestDTO,
  PoapEventEndRequestDTO,
} from './../dtos/poap-event.dtos';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PoapParticipantsModel } from '../models/poap-participants.model';
import { PoapSettingsModel } from '../models/poap-settings.model';
import { Client } from 'discord.js';
import { DiscordClientProvider } from '@discord-nestjs/core';
import { PoapEventResponseDTO } from '../dtos/poap-event.dtos';

@Injectable()
export class PoapEventService {
  private client: Client;

  constructor(
    @InjectModel(PoapSettingsModel)
    private readonly poapSettingsModel: ReturnModelType<
      typeof PoapSettingsModel
    >,
    @InjectModel(PoapParticipantsModel)
    private readonly poapParticipantsModel: ReturnModelType<
      typeof PoapParticipantsModel
    >,
    private readonly discordClientProvider: DiscordClientProvider
  ) {
    this.client = this.discordClientProvider.getClient();
  }

  async getEvents(guildId: string): Promise<PoapEventResponseDTO[]> {
    const result = await this.poapSettingsModel.find({
      discordServerId: guildId,
    });

    // Return events with active members in channel
    return Promise.all(
      result.map(async (event: PoapSettingsModel) => {
        return {
          ...event,
          participants: await this.getParticipants(
            event?.discordServerId,
            event?.voiceChannelId
          ),
        };
      })
    );
  }

  async startEvent({
    event,
    duration,
    discordUserId,
    discordServerId,
    voiceChannelId,
  }: PoapEventStartRequestDTO) {
    // Fetch data from discord
    const guild = await this.client.guilds.fetch(discordServerId);
    const voiceChannel = await guild.channels
      .fetch(voiceChannelId)
      .catch(() => {
        throw new NotFoundException(
          `No voice channel found with ID: ${voiceChannelId}`
        );
      });

    // Check for existing event
    const activeEvent = await this.poapSettingsModel.findOne({
      discordServerId: discordServerId,
      voiceChannelId: voiceChannelId,
      isActive: true,
    });

    if (activeEvent !== null) {
      throw new Error(
        `Active event for server ID "${discordServerId}" in voice channel: ${voiceChannelId}`
      );
    }

    // Otherwise start a new one
    const startTime = new Date();
    await this.poapSettingsModel.findOneAndUpdate(
      {
        discordServerId: discordServerId,
        voiceChannelId: voiceChannelId,
      },
      {
        $set: {
          event: event,
          isActive: true,
          startTime: startTime.toISOString(),
          endTime: new Date(
            startTime.getTime() + duration * 60000
          ).toISOString(),
          discordUserId: discordUserId,
          voiceChannelId: voiceChannel.id,
          voiceChannelName: voiceChannel.name,
          discordServerId: discordServerId,
        },
      },
      {
        upsert: true,
      }
    );

    // Add current participants
    const members = voiceChannel?.members;
    await this.removeParticipants(discordServerId, voiceChannelId);
    await Promise.all(
      members.map((member) => {
        const participant: PoapParticipantsModel = {
          event: event,
          discordUserId: member.id,
          discordUserTag: member.displayName,
          startTime: startTime.toISOString(),
          endTime: new Date(
            startTime.getTime() + duration * 60000
          ).toISOString(),
          voiceChannelId: voiceChannelId,
          discordServerId: discordServerId,
          durationInMinutes: 0,
        };
        this.addParticipant(participant, event);
      })
    );
  }

  async endEvent({ discordServerId, voiceChannelId }: PoapEventEndRequestDTO) {
    const result = await this.poapSettingsModel.findOneAndUpdate(
      {
        discordServerId: discordServerId,
        voiceChannelId: voiceChannelId,
        isActive: true,
      },
      {
        $set: {
          isActive: false,
          endTime: new Date().toISOString(),
        },
      }
    );

    if (result === null) {
      throw new NotFoundException(
        `No active event found for server ID "${discordServerId}" in voice channel: ${voiceChannelId}`
      );
    }
    return result;
  }

  async getParticipants(guildId: string, voiceChannelId: string) {
    return await this.poapParticipantsModel.find({
      discordServerId: guildId,
      voiceChannelId: voiceChannelId,
    });
  }

  async addParticipant(participant: PoapParticipantsModel, event: string) {
    return await this.poapParticipantsModel.create({
      event: event,
      discordUserId: participant.discordUserId,
      discordUserTag: participant.discordUserTag,
      startTime: participant.startTime,
      endTime: null,
      voiceChannelId: participant.voiceChannelId,
      discordServerId: participant.discordServerId,
      durationInMinutes: 0,
    });
  }

  async removeParticipants(guildId: string, voiceChannelId: string) {
    return await this.poapParticipantsModel.deleteMany({
      discordServerId: guildId,
      voiceChannelId: voiceChannelId,
    });
  }
}
