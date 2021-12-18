import ytdl from 'ytdl-core';
import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';
import logger from '../config/logger.js';

// TODO: refactor -> function xy helyett const xy = () =>
// TODO: /pause

const NAMESPACE = 'AudioPlayer';

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
  },
});

// Visszaadja a lejátszó állapotát
function getPlayerStatus() {
  return player.state.status;
}

var connectionActive;

// Visszaadja bool-ként, hogy megy-e éppen zene
function isActive() {
  return connectionActive;
}

var connection;

// Csatlakozás a hangcsatornához
function connect(connectionData) {
  connection = joinVoiceChannel({
    channelId: connectionData.channelId,
    guildId: connectionData.guildId,
    adapterCreator: connectionData.adapterCreator,
  });

  connectionActive = true;
  connection.subscribe(player);

  logger.info(
    NAMESPACE,
    `A bot csatlakozott egy hangcsatornához. (ID: ${connectionData.channelId})`
  );
}

const queue = new Map();

// Visszaadja hány zene van a lejátszási listában
function getQueueSize() {
  return queue.size;
}

var resource;

// A soron következő zene lejátszása, ha van zene a listában
function playQueue() {
  if (queue.size > 0) {
    connectionActive = true;
    const data = queue.entries().next();
    const url = data.value[1].url;
    const stream = ytdl(url, { filter: 'audioonly' });
    resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    player.play(resource);

    logger.info(NAMESPACE, `A következő zene elindult. (Link: ${url})`);

    queue.delete(data.value[0]);
    return true;
  }
  return false;
}

// Zene hozzáadása a lejátszási listához
function addToQueue(id, username, url) {
  queue.set(id, { user: username, url: url });
  logger.info(NAMESPACE, `${username} hozzadott egy zenét a lejátszási listához. (Link: ${url})`);

  // Csak akkor indítsa el a következő zenét, ha nem megy semmi éppen
  if (player.state.status == 'idle') {
    playQueue();
  }
}

// Zene megállítása - /stop
function stop(user) {
  player.stop();
  connectionActive = false;

  logger.info(NAMESPACE, `${user} megállította a zene lejátszását.`);
}

// Ha nincs zene lejátszva 30 másodpercig, automatikusan kilép
player.on(AudioPlayerStatus.Idle, () => {
  // Ha van a lejátszási listában valami, akkor induljon el
  if (playQueue()) return;

  connectionActive = false;
  return setTimeout(() => {
    logger.info(NAMESPACE, 'A bot inaktivitás miatt lecsatlakozott.');
    return connection.destroy();
  }, 30_000);
});

export default {
  getPlayerStatus: getPlayerStatus,
  getQueueSize: getQueueSize,
  isActive: isActive,
  connect: connect,
  addToQueue: addToQueue,
  stop: stop,
};
