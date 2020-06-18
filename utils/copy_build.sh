#!/bin/bash

cp -r ./wlc-engine ./dist/wlc-engine
cp .editorconfig ./dist/wlc-engine
cp README.md ./dist/wlc-engine
cp WLC-Engine.xmind ./dist/wlc-engine
cp angular.json ./dist/wlc-engine
cp locales.json ./dist/wlc-engine
cp make_release.sh ./dist/wlc-engine
cp tsconfig.json ./dist/wlc-engine
cp package.json ./dist/wlc-engine
cp tslint.json ./dist/wlc-engine

sed -i -e "s/\"private\": true/\"private\": false/g" ./dist/wlc-engine/package.json

# cd ./dist/wlc-engine
# npm pack
