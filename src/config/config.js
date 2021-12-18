import dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const color = '#7d7d7d';

let devmode = false;

const getDevelopmentMode = () => devmode;
const setDevelopmentMode = (bool) => (devmode = bool);

export { clientId, guildId, token, youtubeApiKey, color, getDevelopmentMode, setDevelopmentMode };
