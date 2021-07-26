FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./client/package*.json ./client
COPY yarn.lock ./

RUN npm install
RUN npm install ./client
RUN yarn

COPY . .

EXPOSE 3000
EXPOSE 5000

CMD ["yarn", "dev"]
