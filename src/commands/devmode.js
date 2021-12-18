import { SlashCommandBuilder } from '@discordjs/builders';
import dripCheck from '../misc/dripCheck.js';
import { setDevelopmentMode } from '../config/config.js';
import { MessageEmbed } from 'discord.js';
import { color } from '../config/config.js';

const data = new SlashCommandBuilder()
  .setName('devmode')
  .setDescription('Fejlesztői mód beállítása.')
  .addBooleanOption((option) =>
    option.setName('bool').setDescription('true / false').setRequired(true)
  );

export default {
  data: data,
  async execute(interaction) {
    // Ha az illető személyesen emigel de santos
    if (dripCheck(interaction)) {
      if (interaction.options.getBoolean('bool') == true) {
        setDevelopmentMode(true);
        return await interaction.reply('Fejlesztői mód aktiválva.');
      }
      setDevelopmentMode(false);
      return await interaction.reply('Fejlesztői mód kikapcsolva.');
    }
    // Ha nem, akkor meg csak az anyádat
    const embed = new MessageEmbed()
      .setColor(color)
      .setImage('https://c.tenor.com/SyFmo3o9f5AAAAAC/tomcat-tam%C3%A1s.gif');
    return await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
