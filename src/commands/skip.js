import { SlashCommandBuilder } from '@discordjs/builders';
import audioPlayer from '../misc/audioPlayer.js';

const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Átugorja az éppen aktuális zenét.');

// TODO: üzenet szépítése (embed)
export default {
  data: data,
  async execute(interaction) {
    const username = interaction.member.user.username;
    if (audioPlayer.getQueueSize() > 0) {
      audioPlayer.skip(username);
    } else {
      audioPlayer.stop(username, true);
    }
    return await interaction.reply('A most jászott zene át lett ugorva.');
  },
};
