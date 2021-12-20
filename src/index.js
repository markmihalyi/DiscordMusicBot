import fs from 'node:fs';
import { Client, Collection, MessageEmbed } from 'discord.js';
import { token, color, getDevelopmentMode } from './config/config.js';
import logger from './config/logger.js';
import dripCheck from './misc/dripCheck.js';
import Timeout from 'await-timeout';

const NAMESPACE = 'Main';

// Kliens példány létrehozása
const client = new Client({ intents: ['GUILDS', 'GUILD_VOICE_STATES'] });

// Események (eventek) kezelése
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = await import(`./events/${file}`);
  if (event.default.once) {
    // a = argumentumok
    client.once(event.default.name, (...a) => event.default.execute(...a));
  } else {
    // a = argumentumok
    client.on(event.default.name, (...a) => event.default.execute(...a));
  }
}

// Parancsok kezelése
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  // A kulcs a parancs neve,
  // az érték pedig az exportált modul.
  client.commands.set(command.default.data.name, command);
}

// Parancshasználat lekezelése
client.on('interactionCreate', async (interaction) => {
  const guildId = interaction.guildId;
  const guildName = interaction.guild.name;
  await logger.createFileIfNotExist(`./logs/${guildId}.log`, guildName);

  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  if (getDevelopmentMode() && !dripCheck(interaction)) {
    const embed = new MessageEmbed()
      .setColor(color)
      .setDescription('Nem mentél át a drip checken. :weary:')
      .setImage('https://c.tenor.com/hSriDKQclBQAAAAd/tomcat-polg%C3%A1r-tam%C3%A1s.gif');
    return await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  try {
    await command.default.execute(interaction, client);
  } catch (error) {
    const guildId = interaction.guildId;
    logger.error(NAMESPACE, guildId, 'Hiba történt.', error);
    await interaction.reply({
      content: 'Hiba történt, keress fel! `𝗠𝗜𝗚𝗘𝗟#2059`',
      ephemeral: true,
    });
  }
});

// Bejelentkezés client tokennel
client.login(token);
