FROM node:20-alpine as build-deps
WORKDIR /usr/src/app
COPY . ./
RUN apk add git
RUN npm install
RUN npm build

FROM nginx:1.25-alpine-slim
EXPOSE 8082
COPY cfg/8082_isp-admin-ui.conf /etc/nginx/conf.d/8081_isp-admin-ui.conf
COPY --from=build-deps /usr/src/app/build /opt/msp/isp-admin-ui

