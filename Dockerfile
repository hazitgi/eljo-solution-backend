FROM node:20.17.0

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn add --dev @nestjs/cli

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]