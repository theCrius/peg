'use strict'
const request = require('request');
const moment = require('moment');
const _ = require('lodash');

function init() {
  getJSON('http://files.peg.co/zoella_videos.json')
  .then((data) => {
    data.videos = data.videos.map(getLikePercentage);
    data.mostLikedVideo = getMostLikedVideoTitle(data.videos);
    data.averageLikePercent = getAverageLikePercent(data.videos);
    data.totalViews = getTotalViews(data.videos);
    data.uploadFrequency = getUpdateFrequency(data.videos);
    delete data.videos;
    console.log(data);
  }).catch((error)=>{
    console.log(error);
  });
};

function getJSON(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (error) {
        reject({code: 'EXT_ERR', msg: "Issues with the 3rd party source:"+error.message})
      } else {
        if (response.headers['content-type'] === 'application/json') {
          resolve(JSON.parse(response.body));
        } else {
          reject({code: 'NOT_JSON', msg: "The external resource was not a JSON"});
        }
      }
    });
  });
}

function getLikePercentage(video) {
  video.likePercentage = (video.likes/(video.likes+video.dislikes)) * 100;
  return video;
}

function getMostLikedVideoTitle(videos) {
  return videos.reduce((prev, current) => { return prev.likePercentage > current.likePercentage ? prev.title : current.title })
}

function getAverageLikePercent(videos) {
  let totalPercentage = 0;
  videos.forEach((video) => {
    totalPercentage += video.likePercentage;
  });
  return totalPercentage/videos.length;
}

function getTotalViews(videos) {
  let totalViews = 0;
  videos.forEach((video) => {
    totalViews += video.views;
  });
  return totalViews;
}


function getUpdateFrequency(videos) {
  videos = _.sortBy(videos, [(video) => {moment(video.published_at).valueOf()}]);
  let differences = [];
  for (let i = 0; i < videos.length; i++) {
    if (videos[i+1] !== undefined) {
      differences.push(moment(videos[i].published_at).valueOf() - moment(videos[i+1].published_at).valueOf());
    }
  }
  let average = differences.reduce((cur, next) => { return cur+next }, 0) / differences.length;
  return {
    humanized: moment.duration(average).humanize(),
    asHours: moment.duration(average).asHours()
  };
}

init();
