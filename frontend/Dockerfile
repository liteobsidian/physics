FROM node:24-alpine3.21 AS build
WORKDIR /app
COPY ./package*.json ./
COPY ./package-lock*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]