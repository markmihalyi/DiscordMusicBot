import fs, { write } from 'node:fs';

function writeToFile(text) {
  fs.appendFile('latest.log', '\n' + text, (error_) => {
    if (error_) {
      console.error('[ERROR] Hiba történt a log fájlba írásakor!');
    }
  });
}

const startText = '--- A bot elindult ---';
writeToFile(startText);

const getTimeStamp = () => {
  return new Date().toISOString();
};

const info = (namespace, message, object) => {
  var text = `[${getTimeStamp()}] [INFO] [${namespace}] ${message}`;
  if (object) {
    console.info(text, object);
  } else {
    console.info(text);
  }
  writeToFile(text);
};

const warn = (namespace, message, object) => {
  var text = `[${getTimeStamp()}] [WARN] [${namespace}] ${message}`;
  if (object) {
    console.warn(text, object);
  } else {
    console.warn(text);
  }
  writeToFile(text);
};

const error = (namespace, message, object) => {
  var text = `[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`;
  if (object) {
    console.error(text, object);
  } else {
    console.error(text);
  }
  writeToFile(text);
};

const debug = (namespace, message, object) => {
  var text = `[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`;
  if (object) {
    console.debug(text, object);
  } else {
    console.debug(text);
  }
  writeToFile(text);
};

export default {
  info,
  warn,
  error,
  debug,
};
