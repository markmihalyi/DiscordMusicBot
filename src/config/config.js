import dotenv from 'dotenv';
import fs from 'node:fs';
import logger from './logger.js';
dotenv.config();

const NAMESPACE = 'CONFIG';

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const color = '#a11d39';

const getDevelopmentMode = () => {
  const data = fs.readFileSync('./config/devmode.txt').toString();
  if (data === 'true') {
    return true;
  }
  return false;
};

const setDevelopmentMode = (bool) => {
  fs.writeFile('./config/devmode.txt', `${bool}`, (error) => {
    if (error)
      return logger.error(
        NAMESPACE,
        undefined,
        'Nem sikerült felülírni a fejlesztői mód konfigurációját.',
        error
      );
  });
};

export { clientId, guildId, token, youtubeApiKey, color, getDevelopmentMode, setDevelopmentMode };
