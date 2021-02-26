FROM node:12.16.2-alpine3.11 AS BUILD
# alipine的默认时区不是中国 需要设置一下
RUN apk --update add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata
    
RUN mkdir -p /usr/src/weChatFront/
WORKDIR /usr/src/weChatFront/
COPY ./package.json /usr/src/weChatFront/package.json
COPY ./package-lock.json /usr/src/weChatFront/package-lock.json
RUN cd /usr/src/weChatFront/ && \
    npm i --registry=https://registry.npm.taobao.org

COPY ./index.html /usr/src/weChatFront/index.html
COPY ./index.js /usr/src/weChatFront/index.js
RUN  npm run build

FROM nginx:latest
COPY  --from=BUILD /usr/src/weChatFront/dist /usr/share/nginx/html

