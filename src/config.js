import dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

export { clientId, guildId, token };
