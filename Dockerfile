FROM node:20.14.0-alpine3.20 AS app

WORKDIR /app

COPY tsconfig.json tailwind.config.js postcss.config.mjs package.json next.config.mjs components.json /app/

COPY src /app/src

RUN yarn install

EXPOSE 3000

ENTRYPOINT [ "yarn", "dev", "-p", "3000" ]
