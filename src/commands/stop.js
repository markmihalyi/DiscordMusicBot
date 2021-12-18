import { SlashCommandBuilder } from '@discordjs/builders';
import audioPlayer from '../misc/audioPlayer.js';

const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Leállítja az éppen aktuális zenét.');

export default {
  data: data,
  async execute(interaction) {
    if (!audioPlayer.isActive()) {
      return await interaction.reply('Nincs folyamatban lévő zene.');
    }
    const user = interaction.member.user.username;
    audioPlayer.stop(user);
    return await interaction.reply('A zene lejátszása le lett állítva.');
  },
};
