import { SlashCommandBuilder } from '@discordjs/builders';
import audioPlayer from '../misc/audioPlayer.js';

const data = new SlashCommandBuilder()
  .setName('pause')
  .setDescription('Szünetelteti a zene lejátszását.');

export default {
  data: data,
  async execute(interaction) {
    const username = interaction.member.user.username;
    if (audioPlayer.getPlayerStatus() == 'playing') {
      audioPlayer.pause(username);
      return interaction.reply({
        content: 'Megállítottad a zene lejátszását.',
        ephemeral: true,
      });
    }
    return interaction.reply({
      content:
        'Most komolyan azt akarod szüneteltetni, ami nincs? Nem is vártam tőled többet... :person_facepalming:',
      ephemeral: true,
    });
  },
};
