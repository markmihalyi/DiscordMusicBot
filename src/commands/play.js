import { SlashCommandBuilder } from '@discordjs/builders';
import audioPlayer from '../misc/audioPlayer.js';
import { MessageEmbed } from 'discord.js';
import youtube from '../misc/youtubeApi.js';

const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Hozzáad egy zenét a lejátszási listához.')
  .addStringOption((option) =>
    option
      .setName('url')
      .setDescription('Add meg a zene vagy videó YouTube linkjét.')
      .setRequired(true)
  );

const queue = new Map(); // TODO: queue

// TODO: timestamp-tól induljon a zene

export default {
  data: data,
  async execute(interaction, client) {
    const url = interaction.options.getString('url');

    // Ha a link nem érvényes youtube link
    if (!youtube.validateYouTubeUrl(url)) {
      return await interaction.reply('A megadott link érvénytelen.');
    }

    const videoData = await youtube.getVideoData(url);

    // Ha a youtube link érvényes, viszont az id érvénytelen
    if (videoData.pageInfo.totalResults == 0) {
      return await interaction.reply('Ez a videó nem létezik.');
    }

    // Ha nincs voice channelben a bot
    if (JSON.stringify(client.voice) == '{"adapters":{}}') {
      const userChannel = interaction.member.voice.channel;
      // Ha nincs voice channelben a felhasználó
      if (!userChannel) {
        return await interaction.reply('Először csatlakozz egy voice channel-hez!');
      }

      audioPlayer.connect({
        channelId: userChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
    }

    audioPlayer.play(url);

    const channelData = await youtube.getChannelData(videoData);

    const embed = new MessageEmbed()
      .setColor('#A91E00')
      .setAuthor(
        youtube.getChannelName(channelData),
        youtube.getChannelAvatar(channelData),
        youtube.getChannelUrl(channelData)
      )
      .setTitle(youtube.getVideoTitle(videoData))
      .setURL(youtube.getVideoUrl(videoData))
      .addFields(
        { name: youtube.getVideoDuration(videoData), value: 'időtartam', inline: true },
        { name: youtube.getVideoViewCount(videoData), value: 'megtekintés', inline: true }
      )
      .addField(youtube.getVideoUploadDate(videoData), 'feltöltés dátuma', true)
      .setImage(youtube.getVideoThumbnail(videoData))
      .setTimestamp()
      .setFooter('Developed by: 𝗠𝗜𝗚𝗘𝗟#2059');

    return await interaction.reply({ embeds: [embed] });
  },
};
