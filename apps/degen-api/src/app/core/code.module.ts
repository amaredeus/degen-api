import { DiscordModule } from '@discord-nestjs/core';
import { Global, Module } from '@nestjs/common';
import { Intents } from 'discord.js';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppConfig } from '../app.config';

const IMPORTS = [
  TypegooseModule.forRoot(AppConfig.MONGODB_URI),
  DiscordModule.forRoot({
    token: AppConfig.DISCORD_TOKEN,
    commands: ['**/*.command.js'],
    discordClientOptions: {
      intents: [Intents.FLAGS.GUILDS],
    },
  }),
];

@Global()
@Module({
  imports: [...IMPORTS],
  controllers: [],
  providers: [],
  exports: [...IMPORTS],
})
export class CoreModule {}
