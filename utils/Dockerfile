FROM debian:latest

ENV NVM_DIR /usr/local/nvm
ENV NVM_VERSION v0.39.3
ENV NODE_VERSION 18
ENV NPM_VERSION 9

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt update && \
    apt install -y curl git chromium && \
    apt clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p $NVM_DIR && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh | bash

RUN source $NVM_DIR/nvm.sh \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default && \
    npm i npm@$NPM_VERSION -g

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
