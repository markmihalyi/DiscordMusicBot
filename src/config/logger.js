import fs from 'node:fs';

function writeToFile(guildId, text) {
  fs.appendFile(`/logs/${guildId}.log`, '\n' + text, (error_) => {
    if (error_) {
      console.error('[ERROR] Hiba történt a log fájlba írásakor!');
    }
  });
}

const startText = '--- A bot elindult ---';
writeToFile(startText);

const getTimeStamp = () => {
  return new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' });
};

const info = (namespace, guildId, message, object) => {
  var text = `[${getTimeStamp()}] [INFO] [${namespace}] ${message}`;
  if (object) {
    console.info(text, object);
  } else {
    console.info(text);
  }
  writeToFile(text, guildId);
};

const warn = (namespace, guildId, message, object) => {
  var text = `[${getTimeStamp()}] [WARN] [${namespace}] ${message}`;
  if (object) {
    console.warn(text, object);
  } else {
    console.warn(text);
  }
  writeToFile(text, guildId);
};

const error = (namespace, guildId, message, object) => {
  var text = `[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`;
  if (object) {
    console.error(text, object);
  } else {
    console.error(text);
  }
  writeToFile(text, guildId);
};

const debug = (namespace, guildId, message, object) => {
  var text = `[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`;
  if (object) {
    console.debug(text, object);
  } else {
    console.debug(text);
  }
  writeToFile(text, guildId);
};

export default {
  info,
  warn,
  error,
  debug,
};
