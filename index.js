
/**
 * get-beautyland-images: Get Beautyland images
 * 
 * This app can help you download images from Beautyland API and Beautyland.
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`Beautyland Image Downloader`);
console.log(`The path of saved images: ${DEFAULT_PATH}`);

const main = async () => {
  while(true){
    console.log('----------');
    console.log('Enter [quit] to exit this app.');
    try{
      const postId = await prompt('Please enter the post id: ');
      if(postId === 'quit'){
        console.log(`Bye`);
        process.exit(0);
        return;
      }
      if(postId === ''){
        console.log(`The post id should not be empty.`);
        continue;
      }

      const post = await fetchPost(postId.trim());
      const promptMessage = `Please enter the file name\n(Keep empty for default: ${post.title}): `;
      const newTitle = await prompt(promptMessage);
      if(newTitle !== ''){
        post.title = newTitle;
      }
      downloadImages(post);
    }catch(ex){
      console.log(ex);
    }
  }
};


const prompt = async (message) => {
  return new Promise( (resolve) => {
    rl.question(message, input => {
      return resolve(input);
    });
  });
};


const fetchPost = (postId) => {
  return new Promise( (resolve, reject) => {
    const url = 'https://beautyland-api.royvbtw.uk/posts/' + postId;
    request.get(url, (error, response, body) => {
      if(error){
        console.log(`Error in request`);
        return reject('Error in fetchPost()');
      }

      if(response && response.statusCode === 200){
        const json = JSON.parse(body);
        return resolve(json);
      }else if(response && response.statusCode === 404){
        return reject(`404: The post [${postId}] does not exist.`);
      }else{
        return reject(`Error: bad response`);
      }
    });
  });
};


const downloadImages = (post) => {
  console.log(`Downloading ${post.title}, ${post.images.length} images`);

  const title = formatTitle(post.title);

  post.images.forEach( (item, i) => {
    console.log(`${i}: Downloading ${item.url}`);
    request.get(item.url)
      .pipe(fs.createWriteStream(buildFilename({
        title,
        index: i, 
        postId: post.postId
      })));
  });
  console.log(`Download finished.`);
};

const buildFilename = ({title, index, postId} = {}) => {
  const formattedIndex = ('0' + index).slice(-2);
  return DEFAULT_PATH + '/' + postId + '_' + title + '_' + formattedIndex + '.jpg';
};

const formatTitle = (title) => {
  return title.replace(/[`~!@$%^&*|:?'"<>\/\\]/g, '_');
};


main();