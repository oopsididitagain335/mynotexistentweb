// bot/commands/me.js
const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('me')
    .setDescription('Show your linked status'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/discord/user?discordId=${interaction.user.id}`);
      const isLinked = response.ok;

      if (isLinked) {
        const data = await response.json();
        await interaction.editReply({
          content: `✅ You are linked to [@${data.username}](${process.env.NEXT_PUBLIC_APP_URL}/${data.username}).`,
        });
      } else {
        await interaction.editReply('❌ You are not linked to a bio link. Use `/link TOKEN` to connect.');
      }
    } catch (err) {
      await interaction.editReply('❌ Could not check your status.');
    }
  },
};
