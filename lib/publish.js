// upload all files to lowdown-interactives /slug/v{fromlowdown}/**
// create/get interactive from lowdown -> bundle -> create revision -> upload -> confirm works -> set public
const util = require('util');
const fetch = require('node-fetch');
const path = require('path');
const mime = require('mime');
const AWS = require('aws-sdk');
const fs = require('fs');

const readFileAsync = util.promisify(fs.readFile);
const readdirAsync = util.promisify(fs.readdir);

function upload(slug, version) {
  const credentials = new AWS.SharedIniFileCredentials({profile: 'lowdowninteractives'});
  AWS.config.credentials = credentials;
  const s3 = new AWS.S3({
    region: 'us-east-1'
  });

  return readdirAsync(path.resolve(process.cwd(), './dist/'))
    .then(dirList => {
      return Promise.all(dirList.map(filePath => {
        return readFileAsync(path.resolve(process.cwd(), './dist/', filePath))
          .then(fileData => {
            const object = {
              ACL: 'public-read',
              Body: fileData,
              ContentType: mime.lookup(filePath),
              Bucket: 'lowdown-interactives',
              Key: `${slug}/v${version}/${filePath}`,
            };
            return s3.upload(object).promise();
          })
      }))
    })
    .catch(error => {
      console.log('It looks like not all files managed to get deployed!');
      throw error;
    })
}

module.exports = function() {
  const name = require(path.resolve(process.cwd(), './package.json')).name

  if (!name.startsWith('interactive-')) {
    throw new Error(`Name in package.json must start with "interactive-" currently is ${name}`);
  }

  if (process.env.LOWDOWN_TOKEN === undefined) {
    throw new Error('LOWDOWN_TOKEN is not set!');
  }

  const token = process.env.LOWDOWN_TOKEN;

  const slug = name.slice(12);
  console.log(`Deploying interactive: ${slug}`)
  let revision = null;
  fetch(`http://localhost:8000/manage/interactives/${slug}/releases/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    }
  })
    .then(data => data.json())
    .then(data => {
      revision = data;
    })
    .then(() => {
      return upload(slug, revision.data.revision_number);
    })
    .then(() => {
        return fetch(`http://localhost:8000/manage/interactives/${slug}/releases/${revision.data.revision_number}/`, {
          method: 'PATCH',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public: true,
          })
        }).then((res) => {
          if (res.ok) {
            console.log(`Published ${slug} as v${revision.data.revision_number}!`);
          }
        }).catch(() => console.log('failed to publish!'));
    })
}