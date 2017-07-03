'use strict'

const Youtube = require("youtube-api");
const fs = require("fs");


// Token assumes scope of:
//   https://www.googleapis.com/auth/youtube.upload
const ACCESS_TOKEN = process.argv[2];
const REFRESH_TOKEN = process.argv[3];
const VIDEO_FILE = process.argv[4];

// TO-ADD
const CLIENT_ID = '...';
const CLIENT_SECRET = '...';

function babyDriver() {
  console.log(`About to upload file (${VIDEO_FILE}) to YouTube with token: ${ACCESS_TOKEN}`);

  let oauth = Youtube.authenticate({
    type: "oauth",
    client_id: CLIENT_ID
    client_secret: CLIENT_SECRET
    token: ACCESS_TOKEN,
    refresh_token: REFRESH_TOKEN,
  });

  const params = {
    resource: {
      snippet: {
        title: "AutoUpload - " + Math.random().toString(36).slice(2),
        description: "A test of automated upload",
      },
      status: {
        privacyStatus: "private"
      },
    },
    part: "snippet,status",
    media: {
      body: fs.createReadStream(VIDEO_FILE)
    }
  };

  var req = Youtube.videos.insert(params, (err, data) => {
    if (err) {
      console.log('Error caught', err);
    } else {
      console.log('Success!', data);

      /**

        Data looks something like this:

        {
          kind: 'youtube#video',
          etag: '"m2yskBQFythfE4irbTIeOgYYfBU/CE24S8KK6lJbkMgY_fmZzhkpZ3Q"',
          id: 'KXsSU1VG5ls',
          snippet: {
            publishedAt: '2017-07-03T18:33:31.000Z',
            channelId: 'UCQXxf3OnDfhPa4jSJ48wmUw',
            title: 'AutoUpload - fwecqsheiglanhfr',
            description: 'A test of automated upload',
            thumbnails: {
              default: [Object],
              medium: [Object],
              high: [Object]
            },
            channelTitle: 'George Mike',
            categoryId: '22',
            liveBroadcastContent: 'none',
            localized: { 
              title: 'AutoUpload - fwecqsheiglanhfr',
              description: 'A test of automated upload'
            }
          },
          status: {
            uploadStatus: 'uploaded',
            privacyStatus: 'private',
            license: 'youtube',
            embeddable: true,
            publicStatsViewable: true
          }
        }

      */
    }
    console.log("Done.");
    process.exit();
  });

  setInterval(function () {
    console.log(`${req.req.connection._bytesDispatched} bytes uploaded.`);
  }, 250);
}

babyDriver();
