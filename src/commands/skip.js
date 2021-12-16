import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Átugorja az éppen aktuális zenét.');

export default {
  data: data,
  async execute(interaction, client) {
    return await interaction.reply('A most jászott zene át lett ugorva.');
  },
};
