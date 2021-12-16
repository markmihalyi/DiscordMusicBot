const youtube = (function () {
  let video, results;

  const getThumbnail = function (url, size) {
    if (url == undefined) {
      return '';
    }

    size = size == undefined ? 'big' : size;
    results = url.match('[\\?&]v=([^&#]*)');
    video = results == undefined ? url : results[1];

    if (size == 'small') {
      return `http://img.youtube.com/vi/${video}/2.jpg`;
    }

    if (size == 'normal') {
      return `http://img.youtube.com/vi/${video}/0.jpg`;
    }

    return `http://img.youtube.com/vi/${video}/maxresdefault.jpg`;
  };

  return {
    thumbnail: getThumbnail,
  };
})();

export default {
  thumbnail: youtube.thumbnail,
};
