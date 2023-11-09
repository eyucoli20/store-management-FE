FROM node:17-alpine

WORKDIR /store-management-FE

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

