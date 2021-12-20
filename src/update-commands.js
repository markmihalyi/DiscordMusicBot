import fs from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId, token } from './config/config.js';

//TODO: Mindegyik guilden menjen végig, frissítse az adatokat
// A 'commands' nevű mappában lévő .js fájlokat
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data);
}

const rest = new REST({ version: '9' }).setToken(token);
rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('[✓] A parancsok listája frissítve lett.'))
  .catch(console.error);
