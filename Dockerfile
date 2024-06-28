FROM node:20-alpine as build-deps
WORKDIR /usr/src/app
COPY . ./
RUN apk add git
RUN npm install
RUN npm run build

FROM nginx:1.25-alpine-slim
EXPOSE 8001
RUN rm -f /etc/nginx/conf.d/default.conf
COPY cfg/80_isp-admin-ui.conf /etc/nginx/conf.d/80_isp-admin-ui.conf
COPY --from=build-deps /usr/src/app/build /opt/msp/isp-admin-ui

