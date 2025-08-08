// bot/commands/profile.js
const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Show user bio link and stats')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to view')
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const tag = user.tag;

    await interaction.deferReply();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/discord/user?discordId=${user.id}`);
      if (!response.ok) {
        return interaction.editReply(`❌ No linked profile found for ${tag}.`);
      }

      const data = await response.json();

      const embed = {
        title: `${data.name} (@${data.username})`,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/${data.username}`,
        description: data.bio || 'No bio set.',
        color: 0x7C3AED,
        fields: [
          { name: 'Category', value: data.category, inline: true },
          { name: 'Followers', value: data.followersCount.toString(), inline: true },
          { name: 'Links', value: data.links.length.toString(), inline: true },
          { name: 'Badges', value: data.badges.join(', ') || 'None', inline: false },
        ],
        thumbnail: { url: data.avatar },
        footer: { text: 'Powered by thebiolink.lol' },
        timestamp: new Date(),
      };

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply(`❌ Could not fetch profile for ${tag}.`);
    }
  },
};
