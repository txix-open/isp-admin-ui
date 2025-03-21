#!/bin/sh

CONFIG_PATH="/opt/msp/isp-admin-ui/config.js"

cat <<EOF > $CONFIG_PATH
// DON'T TOUCH
// THIS FILE FOR PRODUCTION BUILD

window.config = {
  ENABLE_PASSWORD_LOGIN: ${ENABLE_PASSWORD_LOGIN:-true},
  APP_TOKEN: '${APP_TOKEN:-"default_token"}',
};
EOF


exec nginx -g "daemon off;"
