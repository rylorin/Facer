# Facer

[![LICENSE](https://img.shields.io/github/license/rylorin/Facer)](LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/rylorin/Facer)](https://github.com/rylorin/Facer/graphs/contributors)

## With ideas from

https://devdactic.com/ionic-4-image-upload-storage/  
https://capacitor.ionicframework.com/docs/guides/ionic-framework-app  
https://roblouie.com/article/574/learn-ionic-cordova-file-upload/

## Requirements

install ionic

    $ npm i -g @ionic/cli
  
checkout project

    $ git checkout https://github.com/rylorin/Facer.git
    $ cd facer

## First build of mobile application

    $ cd App
    $ npm install
    $ npx npm-force-resolutions
    $ npm install
    $ ionic build
    $ npx cap add ios
    $ npx cap add android

## Rebuild mobile application after code modification

    $ ionic build
    $ npx cap sync
    $ npx cap open android
