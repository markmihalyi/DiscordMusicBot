import fs from 'node:fs';

const NAMESPACE = 'Logger';

const createFileIfNotExist = async (path, serverName) => {
  try {
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs', () => {});
    }

    if (!fs.existsSync(path)) {
      fs.createWriteStream(path);
      if (path != './logs/_.log') {
        fs.appendFile(path, `[Szerver] ${serverName}`, () => {});
      }
    }
  } catch {
    logger.error(NAMESPACE, undefined, 'Hiba történt.');
  }
};

const writeToFile = (text, guildId) => {
  let path = './logs/_.log';
  if (guildId !== undefined) path = `./logs/${guildId}.log`;

  createFileIfNotExist(path);

  fs.appendFile(path, '\n' + text, (error_) => {
    if (error_) {
      console.error('[ERROR] Hiba történt a log fájlba írásakor!', error_);
    }
  });
};

const getTimeStamp = () => {
  return new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' });
};

const cons = (namespace, message, object) => {
  var text = `[${getTimeStamp()}] [INFO] [${namespace}] ${message}`;
  writeToFile(text);
  if (object) {
    return console.info(text, object);
  }
  return console.info(text);
};

const info = (namespace, guildId, message, object) => {
  var text = `[${getTimeStamp()}] [INFO] [${namespace}] ${message}`;
  if (object) {
    console.info(object);
  }
  return writeToFile(text, guildId);
};

const warn = (namespace, guildId, message, object) => {
  var text = `[${getTimeStamp()}] [WARN] [${namespace}] ${message}`;
  if (object) {
    console.warn(object);
  }
  return writeToFile(text, guildId);
};

const error = (namespace, guildId, message, object) => {
  var text = `[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`;
  if (object) {
    console.error(object);
  }
  return writeToFile(text, guildId);
};

const debug = (namespace, guildId, message, object) => {
  var text = `[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`;
  if (object) {
    console.info(object);
  }
  return writeToFile(text, guildId);
};

export default {
  createFileIfNotExist,
  cons,
  info,
  warn,
  error,
  debug,
};
