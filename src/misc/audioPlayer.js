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

// TODO: /pause

const NAMESPACE = 'AudioPlayer';

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
  },
});

const queue = new Map();

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

var resource;

// Zene lejátszása - /play
function play(url) {
  connectionActive = true;
  const stream = ytdl(url, { filter: 'audioonly' });
  resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
  player.play(resource);

  logger.info(NAMESPACE, `A bot lejátszott egy zenét. (Link: ${url})`);
}

// Zene megállítása - /stop
function stop() {
  player.stop();
  connectionActive = false;

  logger.info(NAMESPACE, 'Valaki megállította a zene lejátszását.');
}

// Ha nincs zene lejátszva 30 másodpercig, automatikusan kilép
player.on(AudioPlayerStatus.Idle, () => {
  connectionActive = false;
  setTimeout(() => {
    logger.info(NAMESPACE, 'A bot inaktivitás miatt lecsatlakozott.');
    return connection.destroy();
  }, 30_000);
});

export default {
  queue: queue,
  isActive: isActive,
  connect: connect,
  play: play,
  stop: stop,
};
