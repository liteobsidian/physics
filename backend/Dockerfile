FROM node:24-alpine3.21
WORKDIR /app
COPY ./package*.json ./
COPY ./package-lock*.json ./
RUN npm install
COPY . .
CMD ["node", "app.js"]