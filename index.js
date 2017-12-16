
/**
 * get-beautyland-images: Get Beautyland images
 * 
 * This app can help you download images from Beautyland API.
 * 
 * Input: post id
 * Output: images in the given post
 * Output format: [postId]_[postTitle]_[indexNumber].jpg
 * 
 * The downaloded images will be saved in DEFAULT_PATH which is a variable
 * in the config file in ./config/index.js
 * 
 * @author Roy Lu(royvbtw)
 */

const fs = require('fs');
const process = require('process');
const request = require('request');
const readline = require('readline');

const DEFAULT_PATH = require('./config').defaultPath;

// Create the directory if the path does not exist
if(!fs.existsSync(DEFAULT_PATH)){
  fs.mkdirSync(DEFAULT_PATH);
}

console.log('Enter quit to exit this app.');

const rl = readline.createInterface({
  input: process.stdin, 
  output: process.stdout,
  prompt: 'Please enter the post id: '
});

rl.prompt();

rl.on('line', async (line) => {
  switch(line){
    case 'quit':
      rl.close();
      break;
    default:
      try{
        const post = await fetchPost(line.trim());
        downloadImages(post);
        rl.prompt();
        break;
      }catch(ex){
        console.log('Error: ', ex);
        rl.prompt();
        break;
      }
  }
}).on('close', () => {
  console.log(`Bye`);
  process.exit(0);
});

const fetchPost = (postId) => {
  return new Promise( (resolve, reject) => {
    const url = 'https://beautyland-api.royvbtw.uk/post/' + postId;
    request.get(url, (error, response, body) => {
      if(error){
        return reject('Error in fetchPost()');
      }

      if(response && response.statusCode === 200){
        const json = JSON.parse(body);
        return resolve(json);
      }else if(response && response.statusCode === 404){
        const json = JSON.parse(body);
        return reject(`404: ${json.message}`);
      }else{
        return reject(`Error: bad response`);
      }
    });
  });
};

const downloadImages = (post) => {
  console.log(`Downloading ${post.title}, ${post.images.length} images`);

  post.images.forEach( (item, i) => {
    console.log(`${i}: Downloading ${item.url}`);
    request.get(item.url)
      .pipe(fs.createWriteStream(buildFilename({
        title: post.title, index: i, postId: post.postId
      })));
  });
};

const buildFilename = ({title, index, postId} = {}) => {
  const formattedIndex = ('0' + index).slice(-2);
  return DEFAULT_PATH + '/' + postId + '_' + title + '_' + formattedIndex + '.jpg';
};
