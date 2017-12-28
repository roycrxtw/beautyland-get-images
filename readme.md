# get-beautyland-images: A Beautyland image downloader

This app can help you download images from [Beautyland](https://beautyland.royvbtw.uk/) and [Beautyland-API](https://beautyland-api.royvbtw.uk/)

## Requirement

This app requires node.js and npm.

## Usage

+ **Input**: The post id
+ **Output**: Images for the given post
+ **Output format**: [postId]_[postTitle]_[indexNumber].jpg

The downaloded images will be saved in DEFAULT_PATH which is a variable in the config file in ./config/index.js

## How to find out the Post-ID

For the example url below:
```
// For beautyland
https://beautyland.royvbtw.uk/post/**M.1508758506.A.F1D**
post-id: M.1508758506.A.F1D

// For Beautyland-API
https://beautyland-api.royvbtw.uk/post/**M.1514476752.A.871**
post-id: M.1514476752.A.871

```
the string after /post/ is the post id.

## License
MIT

