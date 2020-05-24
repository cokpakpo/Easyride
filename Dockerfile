#Specify base image

FROM node:alpine

WORKDIR /usr/app

COPY ./package.json ./

#install dependencies
RUN npm install

COPY ./ ./


#Default comman
CMD ["npm", "start"]