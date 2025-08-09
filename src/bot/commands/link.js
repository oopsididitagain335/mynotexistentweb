// bot/commands/link.js
const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Discord to your bio link')
    .addStringOption(option =>
      option.setName('token')
        .setDescription('Your 32-character link token')
        .setRequired(true)),

  async execute(interaction) {
    const token = interaction.options.getString('token');

    await interaction.deferReply({ ephemeral: true });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/discord/verify-token?token=${token}`);
      if (!response.ok) {
        return interaction.editReply('❌ Invalid or expired token.');
      }

      const data = await response.json();
      const userId = data.userId;

      // Update user in Firebase
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: 'discord',
          value: { id: interaction.user.id, username: interaction.user.tag },
        }),
        // In prod: sign request with service account
      });

      await interaction.editReply('✅ Your Discord has been linked! You’ve earned the **Verified** badge.');
    } catch (err) {
      await interaction.editReply('❌ Failed to link account. Please try again.');
    }
  },
};
