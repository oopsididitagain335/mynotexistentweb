// bot/commands/ban.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from server and website')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to ban')
        .setRequired(true))
    .setDefaultMemberPermissions(0x0000000000000008), // BAN_MEMBERS

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ User not in server.', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: '❌ I cannot ban this user.', ephemeral: true });
    }

    await member.ban({ reason: 'Banned via /ban command' });
    await interaction.reply({ content: `✅ ${user.tag} has been banned from the server and thebiolink.lol.`, ephemeral: false });
  },
};
