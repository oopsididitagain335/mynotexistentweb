// lib/discord.ts
// This file is for shared utilities used by the Discord bot
// The bot itself runs in Node.js worker (bot/index.js)

import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';

// Initialize Discord bot client (used in bot/index.js)
export const createDiscordClient = () => {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildBans,
    ],
  });
};

// Register slash commands
export const registerDiscordCommands = async () => {
  const commands = [
    {
      name: 'profile',
      description: 'Show user bio link and stats',
      options: [{
        name: 'user',
        type: 6, // USER
        description: 'User to view',
        required: false,
      }],
    },
    {
      name: 'link',
      description: 'Link your Discord to your bio link',
      options: [{
        name: 'token',
        type: 3, // STRING
        description: 'Your 32-character link token',
        required: true,
      }],
    },
    {
      name: 'ban',
      description: 'Ban a user from server and website',
      options: [{
        name: 'user',
        type: 6,
        description: 'User to ban',
        required: true,
      }],
    },
    {
      name: 'unban',
      description: 'Unban a user from server and website',
      options: [{
        name: 'user',
        type: 6,
        description: 'User to unban',
        required: true,
      }],
    },
    {
      name: 'status',
      description: 'Check a user’s link and ban status',
      options: [{
        name: 'user',
        type: 6,
        description: 'User to check',
        required: true,
      }],
    },
    {
      name: 'me',
      description: 'Show your linked status',
    },
    {
      name: 'verify',
      description: 'Force re-check link status',
      options: [{
        name: 'user',
        type: 6,
        description: 'User to verify',
        required: true,
      }],
    },
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_SERVER_ID!),
      { body: commands }
    );
    console.log('✅ Discord slash commands registered');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
};
