import ytdl from 'ytdl-core';
import {
  AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';

const player = createAudioPlayer();

function connect(connectionData) {
  const connection = joinVoiceChannel({
    channelId: connectionData.channelId,
    guildId: connectionData.guildId,
    adapterCreator: connectionData.adapterCreator,
  });

  connection.subscribe(player);
  try {
    player.on(AudioPlayerStatus.Idle, () => connection.destroy());
  } catch {}
}

function play(url) {
  const stream = ytdl(url, { filter: 'audioonly' });
  const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
  player.play(resource);
}

function stop() {
  try {
    player.stop();
  } catch {}
}

export default {
  connect: connect,
  play: play,
  stop: stop,
};
