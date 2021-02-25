FROM node:15.10.0-alpine3.10 AS BUILD

RUN mkdir -p /usr/src/weChatFront/
WORKDIR /usr/src/weChatFront/
COPY ./package.json /usr/src/weChatFront/package.json
RUN cd /usr/src/weChatFront/ && \
    npm i --registry=https://registry.npm.taobao.org
COPY ./index.html /usr/src/weChatFront/index.html
COPY ./index.js /usr/src/weChatFront/index.js
RUN  parcel build index.html