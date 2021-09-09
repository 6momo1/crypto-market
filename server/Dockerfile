FROM node:15
WORKDIR ./app
COPY package.json .
COPY .env .
COPY ./build .
RUN npm install
EXPOSE 5000
CMD ["cd", "./build"]
CMD ["node", "server.js"]