import dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;
const youtube_api_key = process.env.YOUTUBE_API_KEY;

export { clientId, guildId, token, youtube_api_key };
