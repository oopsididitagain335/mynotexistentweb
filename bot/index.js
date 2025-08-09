// bot/index.js
require('module-alias/register');

const { createDiscordClient, registerDiscordCommands } = require('@lib/discord');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Add fetch import for Node.js

// Create Discord client
const client = createDiscordClient();

// Load commands
client.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[WARNING] The command at ${filePath} is missing "data" or "execute" property.`);
  }
}

// Bot ready event
client.once('ready', () => {
  console.log(`🤖 Discord bot logged in as ${client.user.tag}`);
  registerDiscordCommands();
});

// Interaction handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({ content: '❌ There was an error while executing this command.', ephemeral: true });
    }
  }
});

// Sync ban add event
client.on('guildBanAdd', async (guild, user) => {
  if (guild.id !== process.env.DISCORD_SERVER_ID) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/sync-ban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discordId: user.id }),
    });

    if (response.ok) {
      console.log(`🔁 Ban synced for ${user.tag}`);
    } else {
      console.error(`❌ Failed to sync ban for ${user.tag}`);
    }
  } catch (error) {
    console.error(`❌ Error syncing ban for ${user.tag}`, error);
  }
});

// Sync ban remove event
client.on('guildBanRemove', async (guild, user) => {
  if (guild.id !== process.env.DISCORD_SERVER_ID) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/sync-unban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discordId: user.id }),
    });

    if (response.ok) {
      console.log(`🔁 Unban synced for ${user.tag}`);
    } else {
      console.error(`❌ Failed to sync unban for ${user.tag}`);
    }
  } catch (error) {
    console.error(`❌ Error syncing unban for ${user.tag}`, error);
  }
});

// Login the bot
client.login(process.env.DISCORD_BOT_TOKEN);
