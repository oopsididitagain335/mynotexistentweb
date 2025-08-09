// Register module alias early
require('module-alias/register');

const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch'); // node-fetch v3 is ESM-only; for CJS, install v2 or use dynamic import

// Import discord functions using alias
const { createDiscordClient, registerDiscordCommands } = require('@lib/discord');

// Create Discord client
const client = createDiscordClient();

// Load commands from bot/commands folder
client.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.existsSync(commandsPath)
  ? fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
  : [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[WARNING] The command at ${filePath} is missing "data" or "execute" property.`);
  }
}

// Ready event
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
    await interaction.reply({ content: '❌ There was an error while executing this command.', ephemeral: true });
  }
});

// Guild ban add (sync to web)
client.on('guildBanAdd', async (guild, user) => {
  if (guild.id !== process.env.DISCORD_SERVER_ID) return;

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
});

// Guild ban remove (sync to web)
client.on('guildBanRemove', async (guild, user) => {
  if (guild.id !== process.env.DISCORD_SERVER_ID) return;

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
});

// Login bot
client.login(process.env.DISCORD_BOT_TOKEN);
