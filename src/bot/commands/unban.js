// bot/commands/unban.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from server and website')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to unban')
        .setRequired(true))
    .setDefaultMemberPermissions(0x0000000000000008), // BAN_MEMBERS

  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      await interaction.guild.members.unban(user);
      await interaction.reply({ content: `✅ ${user.tag} has been unbanned from the server and thebiolink.lol.`, ephemeral: false });
    } catch (err) {
      await interaction.reply({ content: '❌ Failed to unban user.', ephemeral: true });
    }
  },
};
