FROM node:17-alpine

WORKDIR /store-management

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

