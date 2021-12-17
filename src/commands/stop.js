import { SlashCommandBuilder } from '@discordjs/builders';
import audioPlayer from '../misc/audioPlayer.js';

const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Leállítja az éppen aktuális zenét.');

// TODO: megcsinálni, hogy /stop-nál ne fagyja szét magát a program
export default {
  data: data,
  async execute(interaction) {
    audioPlayer.stop();
    return await interaction.reply('A zene lejátszása le lett állítva.');
  },
};
