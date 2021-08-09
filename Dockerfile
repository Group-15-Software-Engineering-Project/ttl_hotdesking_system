FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN npm install
#RUN mkdir client
COPY client/package*.json client
WORKDIR  /usr/src/app/client 
RUN npm install --only=dev
WORKDIR /usr/src/app/
RUN yarn

COPY . .

EXPOSE 3000
EXPOSE 5000

CMD ["yarn", "dev"]
