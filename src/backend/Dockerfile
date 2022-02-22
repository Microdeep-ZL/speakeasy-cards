FROM node:alpine3.14
RUN mkdir -p /home/node
RUN npm i -g supervisor
WORKDIR /home/node
ENTRYPOINT ["npm", "run"]
CMD ["start"]