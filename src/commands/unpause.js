import { SlashCommandBuilder } from '@discordjs/builders';
import audioPlayer from '../misc/audioPlayer.js';

const data = new SlashCommandBuilder()
  .setName('unpause')
  .setDescription('Folytatja a zene lejátszását.');

export default {
  data: data,
  async execute(interaction) {
    const username = interaction.member.user.username;
    if (audioPlayer.getPlayerStatus() == 'paused') {
      audioPlayer.unpause(username);
      return interaction.reply({
        content: 'A zene lejátszása mostantól folytatódik.',
        ephemeral: true,
      });
    }
    return interaction.reply({
      content: 'A zene lejátszása nem lett szüneteltetve.',
      ephemeral: true,
    });
  },
};
