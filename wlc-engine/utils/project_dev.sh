#!/bin/bash

if [ -d ../wlc-engine ]; then
    if [ -d ./wlc-engine ]; then
        rm -rf ./wlc-engine
    fi
    ln -s ../wlc-engine/wlc-engine ./wlc-engine
fi

if [ -f roots/template/angular.html ]; then
    rm -rf roots/template/angular.html
fi

ln -s ../static/dist/index.html roots/template/angular.html
