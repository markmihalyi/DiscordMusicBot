import { SlashCommandBuilder } from '@discordjs/builders';
import audioPlayer from '../misc/audioPlayer.js';
import { MessageEmbed } from 'discord.js';
import youtube from '../misc/youtubeMisc.js';

const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Hozzáad egy zenét a lejátszási listához.')
  .addStringOption((option) =>
    option
      .setName('url')
      .setDescription('Add meg a zene vagy videó YouTube linkjét.')
      .setRequired(true)
  );

const queue = new Map(); // todo

// todo: url ellenőrzése, hogy tényleg url-e
// todo: timestamp-tól induljon a zene

export default {
  data: data,
  async execute(interaction, client) {
    const url = interaction.options.getString('url');

    const userChannel = interaction.member.voice.channel;

    // Ha nincs voice channelben a bot
    if (JSON.stringify(client.voice) == '{"adapters":{}}') {
      // Ha nincs voice channelben a felhasználó
      if (!userChannel) {
        return await interaction.reply('Először csatlakozz egy voice channel-hez!');
      }

      const connectionData = {
        channelId: userChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      };

      audioPlayer.connect(connectionData);
    }

    audioPlayer.play(url);

    //return await interaction.reply(`**${interaction.user}** elindított egy zenét. \n(${url})`);

    const embed = new MessageEmbed()
      .setColor('#A91E00')
      //.setAuthor('csatorna neve', 'csatorna kép URL', 'csatorna URL')
      .setTitle('zene/videó neve')
      //.setURL('zene/videó url')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'hossz', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true }
      )
      .addField('Inline field title', 'Some value here', true)
      .setImage(youtube.thumbnail(url))
      .setTimestamp()
      .setFooter('Developed by: 𝗠𝗜𝗚𝗘𝗟#2059');

    return await interaction.reply({ embeds: [embed] });
  },
};
