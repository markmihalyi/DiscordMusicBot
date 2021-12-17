import fs from 'node:fs';
import { Client, Collection } from 'discord.js';
import { token } from './config/config.js';

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

// Interakciók lekezelése
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.default.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'Hiba történt, keress fel! `𝗠𝗜𝗚𝗘𝗟#2059`',
      ephemeral: true,
    });
  }
});

// Bejelentkezés client tokennel
client.login(token);
