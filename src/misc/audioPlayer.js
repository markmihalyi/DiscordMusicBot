import ytdl from 'ytdl-core';
import {
  AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';

const player = createAudioPlayer();

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
}

function play(url) {
  const stream = ytdl(url, { filter: 'audioonly' });
  const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
  player.play(resource);
}

function stop() {
  player.stop();
  connectionActive = false;
}

player.on(AudioPlayerStatus.Idle, () => {
  connection.destroy();
});

export default {
  isActive: isActive,
  connect: connect,
  play: play,
  stop: stop,
};
