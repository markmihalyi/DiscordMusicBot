import axios from 'axios';
import { youtubeApiKey } from '../config/config.js';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

// Dátum beállítások
momentDurationFormatSetup(moment);

moment.updateLocale('en', {
  monthsShort: [
    'jan',
    'feb',
    'márc',
    'ápr',
    'máj',
    'jún',
    'júl',
    'aug',
    'szept',
    'okt',
    'nov',
    'dec',
  ],
});

// API segédfüggvények
function validateYouTubeUrl(url) {
  if (url) {
    var regExp =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (regExp.test(url)) {
      return true;
    }
  }
  return false;
}

function getVideoId(url) {
  const results = url.match('[\\?&]v=([^&#]*)');
  return results == undefined ? url : results[1];
}

//* API lekérdezések

// A videó adatainak lekérdezése
async function getVideoData(url) {
  const videoId = getVideoId(url);

  const response = await axios
    .get('https://youtube.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: youtubeApiKey,
      },
    })
    .catch((error) => {
      console.log(error);
    });

  return response.data;
}

// A feltöltő információinak lekérdezése
async function getChannelData(videoData) {
  const channelId = videoData.items[0].snippet.channelId;

  const response = await axios
    .get('https://youtube.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet',
        id: channelId,
        key: youtubeApiKey,
      },
    })
    .catch((error) => {
      console.log(error);
    });

  return response.data;
}

//* Műveletek a lekért adatokkal

// Feltöltő
function getChannelName(channelData) {
  return channelData.items[0].snippet.title;
}

function getChannelAvatar(channelData) {
  return channelData.items[0].snippet.thumbnails.default.url;
}

function getChannelUrl(channelData) {
  return 'https://www.youtube.com/channel/' + channelData.items[0].id;
}

// Videó
function getVideoTitle(videoData) {
  return videoData.items[0].snippet.title;
}

function getVideoUrl(videoData) {
  return 'https://www.youtube.com/watch?v=' + videoData.items[0].id;
}

function getVideoDuration(videoData) {
  const durationData = videoData.items[0].contentDetails.duration;

  // olvashatóvá kell tenni, mivel máshogy van tárolva
  const durationFormatted = moment.duration(durationData).format('h:mm:ss').padStart(4, '0:0');
  const durationParts = durationFormatted.split(':');
  if (durationParts.length < 3) {
    return `${durationParts[0]}p ${durationParts[1]}mp`;
  }
  return `${durationParts[0]}ó ${durationParts[1]}p ${durationParts[2]}mp`;
}

function getVideoViewCount(videoData) {
  const viewData = videoData.items[0].statistics.viewCount;
  return viewData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function getVideoUploadDate(videoData) {
  const dateData = videoData.items[0].snippet.publishedAt;
  return moment(dateData).format('YYYY. MMM. DD.');
}

// size: default/medium/high/standard/maxres
function getVideoThumbnail(videoData, size) {
  const thumbnails = videoData.items[0].snippet.thumbnails;
  if (!size) return thumbnails.default.url;
  return thumbnails[size].url;
}

export default {
  validateYouTubeUrl,
  getVideoId,
  getVideoData,
  getChannelData,
  getChannelName,
  getChannelAvatar,
  getChannelUrl,
  getVideoTitle,
  getVideoId,
  getVideoUrl,
  getVideoDuration,
  getVideoViewCount,
  getVideoUploadDate,
  getVideoThumbnail,
};
