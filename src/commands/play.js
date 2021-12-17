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

//! Lehet nem kell a channel info legfelül, de majd meglátod

const queue = new Map(); // TODO: queue

// TODO: url ellenőrzése, hogy tényleg url-e
// TODO: timestamp-tól induljon a zene

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

      audioPlayer.connect({
        channelId: userChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
    }

    audioPlayer.play(url);

    const videoData = await youtube.getVideoData(url);
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
