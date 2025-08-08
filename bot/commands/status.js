// bot/commands/status.js
const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check a user’s link and ban status')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check')
        .setRequired(true))
    .setDefaultMemberPermissions(0x0000000000000008), // BAN_MEMBERS

  async execute(interaction) {
    const user = interaction.options.getUser('user');

    await interaction.deferReply();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/discord/user?discordId=${user.id}`);
      const isLinked = response.ok;
      const isBanned = interaction.guild.bans.cache.has(user.id);

      const embed = {
        title: `Status: ${user.tag}`,
        color: isBanned ? 0xEF4444 : isLinked ? 0x10B981 : 0xF59E0B,
        fields: [
          { name: 'Linked to thebiolink.lol', value: isLinked ? '✅ Yes' : '❌ No', inline: true },
          { name: 'Banned', value: isBanned ? '🚫 Yes' : '🟢 No', inline: true },
        ],
        timestamp: new Date(),
      };

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply('❌ Could not fetch status.');
    }
  },
};
