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

const NAMESPACE = 'AudioPlayer';

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
  },
});

var resource;

var connectionActive;

function isActive() {
  return connectionActive;
}

var connection;

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

function play(url) {
  const stream = ytdl(url, { filter: 'audioonly' });
  resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
  player.play(resource);

  logger.info(NAMESPACE, `A bot lejátszott egy zenét. (Link: ${url})`);
}

function stop() {
  player.stop();
  connectionActive = false;

  logger.info(NAMESPACE, 'Valaki megállította a zene lejátszását.');
}

player.on(AudioPlayerStatus.Idle, () => {
  setTimeout(() => {
    logger.info(NAMESPACE, 'A bot inaktivitás miatt lecsatlakozott.');
    return connection.destroy();
  }, 10_000);
});

/* todo: számol és x időnél kilép
player.on(AudioPlayerStatus.Idle, () => {
  connection.destroy();
});
*/

export default {
  isActive: isActive,
  connect: connect,
  play: play,
  stop: stop,
};
