#!/bin/bash

if [ -d ../wlc-engine ]; then
    if [ -d ./wlc-engine ]; then
        rm -rf ./wlc-engine
    fi
    ln -s ../wlc-engine/wlc-engine ./wlc-engine
fi
