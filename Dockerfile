ARG NODE_VERSION=lts
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM deps as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
ARG PUBLIC_PATH=/
ENV PUBLIC_PATH=$PUBLIC_PATH
RUN npm run build

FROM nginx:alpine-slim as final
ARG PUBLIC_PATH=/
ENV PUBLIC_PATH=$PUBLIC_PATH

RUN rm -f /etc/nginx/conf.d/default.conf
COPY cfg/80_isp-admin-ui.conf /etc/nginx/conf.d/80_isp-admin-ui.conf
COPY --from=build /usr/src/app/build /opt/msp/isp-admin-ui${PUBLIC_PATH}/

COPY entrypoint.sh /opt/msp/isp-admin-ui${PUBLIC_PATH}/entrypoint.sh
ENTRYPOINT sh -c "/opt/msp/isp-admin-ui${PUBLIC_PATH}/entrypoint.sh"
