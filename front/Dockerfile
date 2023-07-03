FROM node:latest

RUN apt-get update && apt-get install -y git

WORKDIR /app

COPY . /app

RUN npm install -g @angular/cli

RUN npm install

EXPOSE 4200