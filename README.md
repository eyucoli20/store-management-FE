## Store Management Frontend React App

This repository contains the frontend codebase for the Store Management application. The app can be configured to connect to either a local backend server or a deployed server. Additionally, instructions for running the app using Docker are provided.

## Prerequisites

- Node.js and npm installed on your system.
- Basic knowledge of React and Docker.
- Access to the Store Management backend API (local or deployed).

## Configuration Options:

## Backend Configuration:

## Local Server:

- If you want to configure the app to connect to a local backend server, open the constants.js file.
  Update the baseURL constant to "http://localhost:9191".

## Deployed Server:

- If you want to configure the app to connect to a deployed backend server, open the constants.js file.
  Update the baseURL constant to 'https://storemanagementapi.onrender.com/'.

## Running the App:

## Local Development:

- Navigate to your project directory in the terminal.
- Run npm install to install dependencies. USE NODE VERSION 14.21.3
- Start the development server with npm start.
- Access the app at http://localhost:3000.

## Using Docker:

- Ensure you have Docker installed and running on your system.
- Navigate to the directory containing your Dockerfile and docker-compose.yml file.
- Run docker-compose up to build the Docker image and start the app container.
- Access the app at http://localhost:3000.

## Update Docker Configuration

## Dockerfile (Dockerfile)

---

FROM node:17-alpine

WORKDIR /project name ## Update this line to match your project name

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

## CMD [ "npm", "start" ]

## docker-compose.yml (docker-compose.yml)

---

version: "3.8"
services:
storeapp:
build: ../project name ## Update this line to match your project name
container_name: store_c
ports: - '3000:3000'
stdin_open: true
tty: true

---

## Build Docker Image

- Navigate to the project directory and build the Docker image using the updated Dockerfile and docker-compose.yml:

docker-compose build

## Start Docker Containers

- Start the Docker containers to run the Store Management app locally:
  docker-compose up -d

## Access the App

Once the containers are up and running, you can access the Store Management app by opening your web browser and visiting http://localhost:3000.

## For Login use defualt admin
- For ADMIN
- userName: john
- password: 123456

-For staff manager
- userName: manager
- password: 123456

-For staff 
- userName: staff
- password: 123456
